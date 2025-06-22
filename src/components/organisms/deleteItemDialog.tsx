import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteInventoryMutation } from "@/api/inventoryApi";
import { toast } from "react-hot-toast";

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null; // 👈 add itemId to props
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  itemId,
}: DeleteItemDialogProps) {
  const { mutate: deleteItem, isLoading } = useDeleteInventoryMutation(
    () => {
      toast.success("Inventory item deleted successfully");
      onOpenChange(false);
    },
    (message) => {
      toast.error(message);
    }
  );

  const handleDelete = () => {
    if (!itemId) {
      toast.error("No inventory item selected");
      return;
    }
    deleteItem(itemId);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-auto">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Are you sure?
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            If you delete this inventory item, it will be permanently removed
            from all assigned events.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading || !itemId}
            className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
