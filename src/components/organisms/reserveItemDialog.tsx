import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ReserveItemDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ReserveItemDialog({ open, onOpenChange }: ReserveItemDialogProps) {

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reserve Item</DialogTitle>
          <DialogDescription>
            Please fill out the form to reserve the item.
          </DialogDescription>
        </DialogHeader>
        {/* Form content goes here */}
        <DialogFooter>
          <button className="btn btn-primary">Submit</button>
          <DialogClose className="btn btn-secondary">Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}