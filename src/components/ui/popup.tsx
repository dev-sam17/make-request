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

export const Popup = ({
  clipboard,
  handleRequestBodyChange,
  setClipboard,
}: PopupProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Request Body</AlertDialogTitle>
          <AlertDialogDescription>
            <Textarea
              placeholder="Enter request body (JSON)"
              value={clipboard}
              onChange={(e) => setClipboard(e.target.value)}
              className="font-mono"
              rows={10}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleRequestBodyChange(clipboard)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
