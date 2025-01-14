"use client";

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

const requestTypes = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export default function PostmanClone() {
  const [requestType, setRequestType] = useState(requestTypes[1]);
  const [baseUrl, setBaseUrl] = useState("");
  const [urlPath, setUrlPath] = useState("");
  const [requestBody, setRequestBody] = useState(
    localStorage.getItem("requestBody") || ""
  );
  const [response, setResponse] = useState("");
  const [responseInfo, setResponseInfo] = useState<any>({});
  const [baseUrls, setBaseUrls] = useState<string[]>([]);
  const [urlPaths, setUrlPaths] = useState<string[]>([]);

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
      return json;
    }
  };

  const handleRequestBodyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const formatted = formatJSON(e.target.value);
    setRequestBody(formatted);
    localStorage.setItem("requestBody", formatted);
  };

  const sendRequest = async () => {
    let fullUrl = `${baseUrl}${urlPath}`;
    try {
      if (baseUrl.startsWith("localhost")) {
        fullUrl = `http://${baseUrl}${urlPath}`;
      }
      console.log(fullUrl);
      const options: RequestInit = {
        method: requestType,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (requestType !== "GET" && requestBody) {
        options.body = JSON.stringify(JSON.parse(requestBody));
      }

      console.log(typeof requestBody);
      console.log(requestBody);
      console.log(JSON.parse(requestBody));
      console.log(requestType);

      const startTime = Date.now();
      const res = await fetch(fullUrl, options);
      const endTime = Date.now();

      const responseData = await res.text();
      // setResponse(formatJSON(JSON.stringify(responseData)));
      setResponse(responseData);

      setResponseInfo({
        status: res.status,
        statusText: res.statusText,
        time: `${endTime - startTime}ms`,
        size: `${JSON.stringify(responseData).length} bytes`,
      });
    } catch (error) {
      console.error(error);
      setResponse(
        JSON.stringify({ error: "An error occurred while fetching data" })
      );
      setResponseInfo({});
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">MAKE REQUEST</h1>
      <div className="flex space-x-4">
        <Select value={requestType} onValueChange={setRequestType}>
          <SelectTrigger className="w-[180px]">
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
        <Select onValueChange={(value) => setBaseUrl(value)}>
          <SelectTrigger className="w-[300px]">
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
        <Select onValueChange={(value) => setUrlPath(value)}>
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
      </div>
      <Textarea
        placeholder="Enter request body (JSON)"
        value={requestBody}
        onChange={handleRequestBodyChange}
        className="font-mono"
        rows={10}
      />
      <Button onClick={sendRequest}>Send Request</Button>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Response</h2>
        <div className="bg-gray-100 p-2 rounded mb-2">
          <p>
            Status: {responseInfo.status} {responseInfo.statusText}
          </p>
          <p>Time: {responseInfo.time}</p>
          <p>Size: {responseInfo.size}</p>
        </div>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          <code>{response}</code>
        </pre>
      </div>
    </div>
  );
}
