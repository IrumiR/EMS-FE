import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDeactivateUser} from "@/api/authApi";
import toast from "react-hot-toast";

export function DeactivateUserDialog({
  userId,
  isActive,
  trigger,
}: {
  userId: string;
  isActive: boolean;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const { mutate: updateUserStatus, isLoading } = useDeactivateUser(
    (data) => {
      toast.success(data);
      setOpen(false);
    },
    (message) => {
      toast.error(message);
    }
  );

  const handleToggleStatus = () => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }
    updateUserStatus({ userId, isActive: !isActive });
  };

  const handleCancel = () => setOpen(false);
  const handleOpenChange = (newOpen: boolean) => setOpen(newOpen);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-auto">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Are you sure?
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {isActive
              ? "Deactivating this user will prevent them from accessing their account."
              : "Activating this user will allow them to access their account again."}
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
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={`w-full sm:w-auto px-6 py-2 ${
              isActive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isLoading
              ? isActive
                ? "Deactivating..."
                : "Activating..."
              : isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
