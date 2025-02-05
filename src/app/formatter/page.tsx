"use client";
import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formattedJson, setFormattedJson] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<string[] | string>([]);

  const formatJSON = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      console.log(e);
      return json;
    }
  };

  let responseData: string[] = [];
  const handleFormatJson = () => {
    try {
      if (input.includes("//BOUNDRY//")) {
        responseData = input
          .split("//BOUNDRY//")
          .filter((x: string) => !!x)
          .map((x: string) => formatJSON(x));
      } else {
        responseData.push(formatJSON(input));
      }
      setResponse(responseData);
    } catch (err) {
      console.log(err);
      setFormattedJson(null);
      setError("Invalid JSON. Please enter a valid JSON string.");
    }
  };

  return (
    <div className="container-fluid mx-auto p-4 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-3">JSON Formatter</h2>

      {/* Input Field */}
      <textarea
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
        placeholder="Enter JSON text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Format Button */}
      <button
        onClick={() => handleFormatJson()}
        className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Format JSON
      </button>

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
          console.log(JSON.parse(res));
          return (
            <div key={i} className="my-7">
              
              <JsonView src={JSON.parse(res)} />
            </div>
          );
        })}
    </div>
  );
}
