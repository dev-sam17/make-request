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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface CustomError {
  status: number;
  statusText: string;
  time?: number;
  size?: number;
}

type ResponseInfoType = {
  status: number;
  statusText: string;
  time: number;
  size: number;
}

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
  const [response, setResponse] = useState<string[] | string>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
  const [responseInfo, setResponseInfo] = useState<ResponseInfoType | {}>({});
  const [baseUrls, setBaseUrls] = useState<string[]>([]);
  const [urlPaths, setUrlPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("")

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

      if (!res.ok) {
        const errorDetails: CustomError = {
          status: Number(res.status),
          statusText: res.statusText,
          time: Number(`${endTime - startTime}`),
          size: Number(`${JSON.stringify(res).length}`),
        };
        throw errorDetails;
      }

      const resJson = await res.text()

      let responseData = []
      setLoading(false);

      if (resJson.includes("//BOUNDRY//")) {
        responseData = resJson
          .split("//BOUNDRY//")
          .filter((x: string) => !!x)
          .map((x: string) => formatJSON(x))
      } else {
        responseData.push(formatJSON(resJson));
      }

      setResponse(responseData);

      setResponseInfo({
        status: res.status,
        statusText: res.statusText,
        time: `${endTime - startTime}`,
        size: `${JSON.stringify(responseData).length}`,
      });
    } catch (error: unknown) {
      setLoading(false);
      setResponse([]);
      setResponseInfo("");
      if (typeof error === "object" && error !== null && "status" in error && "statusText" in error) {
        const customError = error as CustomError;
        setResponseInfo({
          status: customError.status,
          statusText: customError.statusText,
          time: customError.time || "Unknown",
          size: customError.size || "Unknown",
        });
        setError(
          JSON.stringify({ error: "An error occurred while fetching data", message: customError })
        );
      } else {
        setError(
          JSON.stringify({ error: "An unknown error occurred", message: String(error) })
        );
      }
    }
  };

  function notify() {
    toast("Copied !!", {
      description: "Response copied to Clipboard",
      action: {
        label: "Done",
        onClick: () => { },
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
        className={`bg-blue-500 dark:bg-blue-300 absolute inset-0 m-auto ${loading ? "visible" : "invisible"
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
        {(!!response.length || !!error) && <div className="bg-gray-100 p-2 rounded mb-2 flex flex-row-reverse">
          <span className="ml-2">
            <strong>Status:</strong> <span className={`${((responseInfo as ResponseInfoType).status > 399) ? "text-red-500" : "text-green-500"}`}>{(responseInfo as ResponseInfoType)?.status} {(responseInfo as ResponseInfoType).statusText}</span>
          </span>
          <span className="ml-2"><strong>Time:</strong> <span className="text-green-500">{(responseInfo as ResponseInfoType).time}ms</span></span>
          <span className="ml-2"><strong>Size:</strong> <span className="text-green-500">{(responseInfo as ResponseInfoType).size}bytes</span></span>
        </div>}
        {!!error && <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          <code>{error}</code>
        </pre>}
        <Accordion type="single" collapsible>
          {(response as string[]).map((res, i) => {
            return (
              <AccordionItem value="item-1" key={i}>
                <AccordionTrigger>Response {i + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className="relative h-96 overflow-auto	">
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                      <code>{res}</code>
                    </pre>
                    {response.length && (
                      <Button
                        className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                        onClick={() => copyText(res)}
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
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  );
}

const PostmanClone = dynamic(() => Promise.resolve(NoSSRPostmanClone), {
  ssr: false,
});

export default PostmanClone;
