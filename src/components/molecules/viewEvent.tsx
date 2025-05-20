import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetEventById} from "@/api/eventApi";
import { Loader2 } from "lucide-react";

interface ViewEventDialogProps {
  title: string;
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewEventDialog({
  title,
  eventId,
  open,
  onOpenChange,
}: ViewEventDialogProps) {
  const { data, isLoading, error } = useGetEventById(open ? eventId : null);
  const event = data?.event;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            Viewing information for event: {title}
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
          <div className="text-sm space-y-3 mt-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
              <strong className="col-span-1">Name:</strong> 
              <span className="col-span-2">{event.eventName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <strong className="col-span-1">Type:</strong> 
              <span className="col-span-2">{event.eventType ? event.eventType.join(", ") : ''}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <strong className="col-span-1">Status:</strong> 
              <span className="col-span-2">{event.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <strong className="col-span-1">Description:</strong> 
              <span className="col-span-2">{event.eventDescription}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <strong className="col-span-1">Location:</strong> 
              <span className="col-span-2">{event.proposedLocation}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <strong className="col-span-1">Start Date:</strong>
              <span className="col-span-2">
                {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <strong className="col-span-1">End Date:</strong>
              <span className="col-span-2">
                {event.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {event.startTime && (
              <div className="grid grid-cols-3 gap-2">
                <strong className="col-span-1">Start Time:</strong>
                <span className="col-span-2">{event.startTime}</span>
              </div>
            )}
            {event.endTime && (
              <div className="grid grid-cols-3 gap-2">
                <strong className="col-span-1">End Time:</strong>
                <span className="col-span-2">{event.endTime}</span>
              </div>
            )}
           <div className="grid grid-cols-3 gap-2">
              <strong className="col-span-1">Client:</strong> 
              <span className="col-span-2">{event?.clientId?.userName}</span>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}