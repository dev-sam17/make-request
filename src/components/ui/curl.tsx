import { useState } from "react";
// import { CURLParser } from "parse-curl-js";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PopupProps {
  clipboard: string;

  handleRequestBodyChange: (clipboard: string) => void;
  setClipboard: React.Dispatch<React.SetStateAction<string>>;
}

export const Curl = ({}: PopupProps) => {
  const [curlText, setCurlText] = useState("");
  console.log(curlText);

  const setCurlRequest = (curlText: string) => {
    const curlParser = new CURLParser(curlText);
    const curl = curlParser.parse();
    console.log(curl);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Import</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Curl Body</AlertDialogTitle>
          <AlertDialogDescription>
            <Textarea
              placeholder="Enter request body (JSON)"
              value={curlText}
              onChange={(e) => setCurlText(e.target.value)}
              className="font-mono"
              rows={10}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setCurlRequest(curlText)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
