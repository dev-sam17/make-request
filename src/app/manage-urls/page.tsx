"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManageUrls() {
  const [newBaseUrl, setNewBaseUrl] = useState("");
  const [newUrlPath, setNewUrlPath] = useState("");
  const [baseUrls, setBaseUrls] = useState<string[]>([]);
  const [urlPaths, setUrlPaths] = useState<string[]>([]);

  useEffect(() => {
    const storedBaseUrls = JSON.parse(localStorage.getItem("baseUrls") || "[]");
    const storedUrlPaths = JSON.parse(localStorage.getItem("urlPaths") || "[]");
    setBaseUrls(storedBaseUrls);
    setUrlPaths(storedUrlPaths);
  }, []);

  const addBaseUrl = () => {
    if (newBaseUrl && !baseUrls.includes(newBaseUrl)) {
      const updatedBaseUrls = [...baseUrls, newBaseUrl];
      setBaseUrls(updatedBaseUrls);
      localStorage.setItem("baseUrls", JSON.stringify(updatedBaseUrls));
      setNewBaseUrl("");
    }
  };

  const addUrlPath = () => {
    if (newUrlPath && !urlPaths.includes(newUrlPath)) {
      const updatedUrlPaths = [...urlPaths, newUrlPath];
      setUrlPaths(updatedUrlPaths);
      localStorage.setItem("urlPaths", JSON.stringify(updatedUrlPaths));
      setNewUrlPath("");
    }
  };

  const removeBaseUrl = (url: string) => {
    const updatedBaseUrls = baseUrls.filter((baseUrl) => baseUrl !== url);
    setBaseUrls(updatedBaseUrls);
    localStorage.setItem("baseUrls", JSON.stringify(updatedBaseUrls));
  };

  const removeUrlPath = (path: string) => {
    const updatedUrlPaths = urlPaths.filter((urlPath) => urlPath !== path);
    setUrlPaths(updatedUrlPaths);
    localStorage.setItem("urlPaths", JSON.stringify(updatedUrlPaths));
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Manage URLs</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Base URLs</h2>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter new base URL"
            value={newBaseUrl}
            onChange={(e) => setNewBaseUrl(e.target.value)}
          />
          <Button onClick={addBaseUrl}>Add</Button>
        </div>
        <ul className="space-y-2">
          {baseUrls.map((url, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{url}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeBaseUrl(url)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">URL Paths</h2>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter new URL path"
            value={newUrlPath}
            onChange={(e) => setNewUrlPath(e.target.value)}
          />
          <Button onClick={addUrlPath}>Add</Button>
        </div>
        <ul className="space-y-2">
          {urlPaths.map((path, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{path}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeUrlPath(path)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
