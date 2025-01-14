"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const requestTypes = ["GET", "POST", "PUT", "DELETE", "PATCH"];

function NoSSRPostmanClone() {
  const [requestType, setRequestType] = useState(requestTypes[1]);
  const [baseUrl, setBaseUrl_1] = useState(
    localStorage.getItem("current_baseurl") || ""
  );
  const [urlPath, setUrlPath_1] = useState(
    localStorage.getItem("current_urlPath") || ""
  );
  const [requestBody, setRequestBody_1] = useState(
    localStorage.getItem("current_requestBody") || ""
  );
  const [response, setResponse] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [responseInfo, setResponseInfo] = useState<any>({});
  const [baseUrls, setBaseUrls] = useState<string[]>([]);
  const [urlPaths, setUrlPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const setBaseUrl = (v: string) => {
    setBaseUrl_1(v);
    localStorage.setItem("current_baseurl", v);
  };

  const setUrlPath = (v: string) => {
    setUrlPath_1(v);
    localStorage.setItem("current_urlPath", v);
  };

  const setRequestBody = (v: string) => {
    setRequestBody_1(v);
    localStorage.setItem("current_requestBody", v);
  };

  useEffect(() => {
    const storedBaseUrls = JSON.parse(localStorage.getItem("baseUrls") || "[]");
    const storedUrlPaths = JSON.parse(localStorage.getItem("urlPaths") || "[]");
    setBaseUrls(storedBaseUrls);
    setUrlPaths(storedUrlPaths);
  }, []);

  const formatJSON = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      console.log(e);
      return json;
    }
  };

  const handleRequestBodyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const formatted = formatJSON(e.target.value);
    setRequestBody(formatted);
  };

  const sendRequest = async () => {
    let fullUrl;
    try {
      if (baseUrl.startsWith("localhost")) {
        fullUrl = new URL(urlPath, `http://${baseUrl}`);
      } else {
        fullUrl = new URL(urlPath, baseUrl);
      }

      const options: RequestInit = {
        method: requestType,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (requestType !== "GET" && requestBody) {
        options.body = JSON.stringify(JSON.parse(requestBody));
      }

      setLoading(true);
      const startTime = Date.now();
      const res = await fetch(fullUrl, options);
      const endTime = Date.now();

      let responseData = await res.text();
      setLoading(false);

      // try {
      if (responseData.includes("//BOUNDRY//")) {
        responseData = responseData
          .split("//BOUNDRY//")
          .filter((x) => !!x)
          .map((x) => formatJSON(x))
          .join("\n\n");
      }

      setResponse(responseData);

      setResponseInfo({
        status: res.status,
        statusText: res.statusText,
        time: `${endTime - startTime}ms`,
        size: `${JSON.stringify(responseData).length} bytes`,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      setResponse(
        JSON.stringify({ error: "An error occurred while fetching data" })
      );
      setResponseInfo({});
    }
  };

  function notify() {
    toast("Copied !!", {
      description: "Response copied to Clipboard",
      action: {
        label: "Done",
        onClick: () => {},
      },
    });
  }

  const copyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notify();
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Spinner
        size="lg"
        className={`bg-blue-500 dark:bg-blue-300 absolute inset-0 m-auto ${
          loading ? "visible" : "invisible"
        }`}
      />

      <div className="flex space-x-4">
        <Select value={requestType} onValueChange={setRequestType}>
          <SelectTrigger className="w-[100px]">
            <SelectValue
              placeholder="Select request type"
              defaultValue={requestType}
            />
          </SelectTrigger>
          <SelectContent>
            {requestTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={baseUrl} onValueChange={(value) => setBaseUrl(value)}>
          <SelectTrigger className="w-[500px]">
            <SelectValue placeholder="Select base URL" />
          </SelectTrigger>
          <SelectContent>
            {baseUrls.map((url) => (
              <SelectItem key={url} value={url}>
                {url}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={urlPath} onValueChange={(value) => setUrlPath(value)}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select URL path" />
          </SelectTrigger>
          <SelectContent>
            {urlPaths.map((path) => (
              <SelectItem key={path} value={path}>
                {path}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={sendRequest}>Send Request</Button>
      </div>
      <Textarea
        placeholder="Enter request body (JSON)"
        value={requestBody}
        onChange={handleRequestBodyChange}
        className="font-mono"
        rows={10}
      />

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Response</h2>
        <div className="bg-gray-100 p-2 rounded mb-2">
          <p>
            Status: {responseInfo?.status} {responseInfo.statusText}
          </p>
          <p>Time: {responseInfo.time}</p>
          <p>Size: {responseInfo.size}</p>
        </div>
        <div className="relative">
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            <code>{response}</code>
          </pre>
          {response && (
            <Button
              className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              onClick={() => copyText(response)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 14l2 2l4 -4"></path>
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const PostmanClone = dynamic(() => Promise.resolve(NoSSRPostmanClone), {
  ssr: false,
});

export default PostmanClone;
