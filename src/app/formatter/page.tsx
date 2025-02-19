"use client";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// import { toast } from "sonner";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export default function JsonFormatter() {
  const [input, setInput11] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formattedJson, setFormattedJson] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<string[] | string>([]);

  const setInput = (value: string) => {
    localStorage.setItem("json", value);
    setInput11(value);
    handleFormatJson(value);
  };

  useEffect(() => {
    setInput(localStorage.getItem("json") || "");
  }, []);

  function safeParse(str = "") {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  const formatJSON = (json: string) => {
    try {
      setError("");
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      console.log(e);
      setError("Invalid JSON");
      return json;
    }
  };

  let responseData: string[] = [];
  const handleFormatJson = (str: string) => {
    try {
      if (str.includes("//BOUNDRY//")) {
        responseData = str
          .split("//BOUNDRY//")
          .filter((x: string) => !!x)
          .map((x: string) => formatJSON(x));
      } else {
        responseData.push(formatJSON(str));
      }
      setError("");
      setResponse(responseData);
    } catch (err) {
      console.log(err);
      setFormattedJson(null);
      setError("Invalid JSON. Please enter a valid JSON string.");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold mb-3">JSON Formatter</h2>

      {/* Input Field */}
      <Textarea
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2"
        rows={5}
        placeholder="Enter JSON text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button
        onClick={() => handleFormatJson(input)}
        className="mt-3 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Format JSON
      </Button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Formatted JSON Output */}
      {/* <Accordion type="single" collapsible>
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
          );
        })}
      </Accordion> */}
      {Array.isArray(response) &&
        response.map((res, i) => {
          // return res;
          return (
            <div key={i} className="my-7">
              <JsonView src={safeParse(res)} />
            </div>
          );
        })}
    </div>
  );
}
