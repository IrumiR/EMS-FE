import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import DatePickerComponent from "../atoms/datePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetAllEventsDropdown } from "@/api/taskApi";
import { useReserveInventoryMutation } from "@/api/inventoryApi";
import toast from "react-hot-toast";

interface ReserveItemDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  itemId: string; // Add itemId prop to identify which item to reserve
}

export function ReserveItemDialog({
  open,
  onOpenChange,
  itemId,
}: ReserveItemDialogProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [quantity, setQuantity] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const eventList = useGetAllEventsDropdown();
  //for reserving item within the event start date and end date
  // const eventList = useGetAllEventsDropdown(undefined, undefined, "active");

  // const selectedEvent = eventList.data?.events?.find(
  //   (event) => event._id === selectedEventId
  // );

  // const eventMinDate = selectedEvent ? new Date(selectedEvent.startDate) : new Date();
  // const eventMaxDate = selectedEvent ? new Date(selectedEvent.endDate) : undefined;
  
  const reserveInventoryMutation = useReserveInventoryMutation(
    (data) => {
      // Success callback
      toast.success(data.message);
      resetForm();
      onOpenChange(false);
      setIsLoading(false);
    },
    (message) => {
      // Error callback
      toast.error(message);
      setIsLoading(false);
    }
  );

  const resetForm = () => {
    setSelectedEventId("");
    setSelectedDate(undefined);
    setQuantity("");
    setIsLoading(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    // Reset form when dialog closes
    if (!isOpen) {
      resetForm();
    }
  };

  const handleEventChange = (value: string) => {
    setSelectedEventId(value);
    setSelectedDate(undefined);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date === null ? undefined : date);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const handleReserve = async () => {
    // Validation
    if (!selectedEventId) {
      toast.error("Please select an event");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (!quantity || parseInt(quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (!itemId) {
      toast.error("Item ID is missing");
      return;
    }

    setIsLoading(true);

    // Format date properly to avoid timezone issues
    const formatDateForAPI = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Prepare reservation data
    const reservationData = {
      itemId: itemId,
      eventId: selectedEventId,
      date: formatDateForAPI(selectedDate),
      reservedQuantity: parseInt(quantity),
    };

    // Call the mutation
    reserveInventoryMutation.mutate(reservationData);
  };

  const isQuantityEnabled = selectedEventId && selectedDate;
  const isReserveButtonEnabled = selectedEventId && selectedDate && quantity && parseInt(quantity) > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] mx-auto">
        <DialogHeader>
          <DialogTitle>Reserve Item</DialogTitle>
          <DialogDescription>
            Please fill out the form to reserve the item.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Event List Select */}
          <div className="grid gap-2">
            <Label htmlFor="event-select" className="text-sm font-medium">
              Event
            </Label>
            <Select
              value={selectedEventId}
              onValueChange={handleEventChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {eventList.data?.events?.length ? (
                  eventList.data.events.map((event) => (
                    <SelectItem key={event._id} value={event._id}>
                      {event.eventName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-events" disabled>
                    No events available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="grid gap-2">
            <Label htmlFor="date-picker" className="text-sm font-medium">
              Date
            </Label>
            <DatePickerComponent
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholderText="Pick a date"
              useMinDate={true}
              minDate={new Date()}
              disabled={isLoading}
              // minDate={eventMinDate}
              // maxDate={eventMaxDate}
              // disabled={!setSelectedEventId || isLoading}
            />
          </div>

          {/* Quantity Input */}
          <div className="grid gap-2">
            <Label htmlFor="quantity-input" className="text-sm font-medium">
              Quantity
            </Label>
            <Input
              id="quantity-input"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={handleQuantityChange}
              disabled={!isQuantityEnabled || isLoading}
              min="1"
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleReserve}
            disabled={!isReserveButtonEnabled || isLoading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          >
            {isLoading ? "Reserving..." : "Reserve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}