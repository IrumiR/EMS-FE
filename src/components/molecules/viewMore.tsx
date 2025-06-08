import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface ViewMoreProps {
  open: boolean;
  onOpenChange: () => void;
}

export default function ViewMore({ open, onOpenChange }: ViewMoreProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>View More</DialogTitle>
          <DialogDescription>
            Additional information will be displayed here.
          </DialogDescription>
        </DialogHeader>

        {/* Content goes here */}
        <div className="text-sm space-y-3 mt-4">
          <p>This is where you can add more details about the item.</p>
        </div>

        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
