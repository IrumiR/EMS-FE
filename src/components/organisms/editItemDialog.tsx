import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export function EditItemDialog({open, onOpenChange}: EditItemDialogProps) {

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen);
    };
 
  return (
   <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Edit item details here.</DialogDescription>
        </DialogHeader>
        {/* Add your item details here */}
      </DialogContent>
      <DialogFooter>
      
      </DialogFooter>
    </Dialog>
  );
}