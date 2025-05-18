import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useApproveEvent, useGetEventById } from "@/api/eventApi";
import toast from "react-hot-toast";

interface ApproveEventDialogProps {
  title: string;
  eventId: string;
  onApprove: () => void;
}

export default function ApproveEventDialog({
  title,
  eventId,
  onApprove,
}: ApproveEventDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useGetEventById(isOpen ? eventId : null);
  const event = data?.event;

  const { mutate: approveEvent, isLoading: isApproving } = useApproveEvent(
    () => {
      toast.success("Event approved successfully");
      onApprove();
      setIsOpen(false);
    },
    (errMsg) => {
      toast.error(`Failed to approve: ${errMsg}`);
    }
  );

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    approveEvent({ eventId, status: { status: "Approved" } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          variant="ghost"
          size="sm"
          className="p-1 mt-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          title="Approve Event"
        >
          Approve Event
          <CheckCircle className="h-4 w-4 ml-1" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve this Event?</DialogTitle>
          <DialogDescription>
            Please review the event details before approving.
          </DialogDescription>
        </DialogHeader>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
            <Loader2 className="animate-spin h-4 w-4" />
            <span>Loading event details...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 mt-4">
            Failed to load event details.
          </p>
        )}

        {/* Event Info */}
        {!isLoading && event && (
          <div className="text-sm space-y-2 mt-2">
            <div>
              <strong>Name:</strong> {event.eventName}
            </div>
            <div>
              <strong>Type:</strong> {event.eventType.join(", ")}
            </div>
            <div>
              <strong>Description:</strong> {event.eventDescription}
            </div>
            <div>
              <strong>Location:</strong> {event.proposedLocation}
            </div>
            <div>
              <strong>Start Date:</strong>{" "}
              {new Date(event.startDate).toLocaleDateString()}
            </div>
            <div>
              <strong>End Date:</strong>{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isApproving || isLoading || !event}
          >
            {isApproving ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Approving...
              </>
            ) : (
              "Confirm Approval"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}