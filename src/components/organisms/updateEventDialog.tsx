import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "primereact/calendar";
import { Clock, Loader2 } from "lucide-react";
import DatePickerComponent from "../atoms/datePicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateEventDialog } from "@/hooks/useUpdateEventDialog";

interface UpdateEventDialogProps {
  title: string;
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startTime: Date | undefined;
  setStartTime: (date: Date | undefined) => void;
  endTime: Date | undefined;
  setEndTime: (date: Date | undefined) => void;
  eventData?: any;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
}

export default function UpdateEventDialog({
  title,
  eventId,
  open,
  onOpenChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  selectedClientId,
  setSelectedClientId,
}: UpdateEventDialogProps) {
  const {
    formik,
    localStartTime,
    localEndTime,
    handleStartTimeChange,
    handleEndTimeChange,
    eventTypes,
    statuses,
    clientsData,
    clientsLoading,
    isUpdating,
    data,
  } = useUpdateEventDialog({
    eventId,
    open,
    onOpenChange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    selectedClientId,
    setSelectedClientId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md max-h-[100vh]"
        key={`update-event-${eventId}-${open}`}
      >
        <ScrollArea className="max-h-[80vh] pr-4">
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
            <DialogDescription>
              Edit information for event: {title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
            {/* Event Title */}
            <div>
              <Label
                htmlFor="eventName"
                className="text-sm font-medium block mb-2"
              >
                Event Title
              </Label>
              <Input
                id="eventName"
                name="eventName"
                placeholder="Event Name"
                value={formik.values.eventName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.eventName && formik.errors.eventName
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.eventName && formik.errors.eventName && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.eventName}
                </p>
              )}
            </div>

            {/* Event Type and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <Label
                  htmlFor="eventType"
                  className="text-sm font-medium block mb-2"
                >
                  Event Type
                </Label>
                <Select
                  name="eventType"
                  value={formik.values.eventType}
                  onValueChange={(value) =>
                    formik.setFieldValue("eventType", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.eventType && formik.errors.eventType && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.eventType}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label
                  htmlFor="status"
                  className="text-sm font-medium block mb-2"
                >
                  Event Status
                </Label>
                <Select
                  name="status"
                  value={formik.values.status}
                  onValueChange={(value) =>
                    formik.setFieldValue("status", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.status}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium block mb-2"
              >
                Description
              </Label>
              <Textarea
                id="eventDescription"
                name="eventDescription"
                placeholder="Description"
                value={formik.values.eventDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Location */}
            <div>
              <Label
                htmlFor="location"
                className="text-sm font-medium block mb-2"
              >
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.location && formik.errors.location
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.location && formik.errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.location}
                </p>
              )}
            </div>

            {/* Start and End Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <Label
                  htmlFor="start-date"
                  className="text-sm font-medium block mb-2"
                >
                  Start Date
                </Label>
                <div className="w-full">
                  <DatePickerComponent
                    selected={startDate}
                    onChange={(date: Date | null) =>
                      setStartDate(date ?? undefined)
                    }
                    dateFormat="MMMM d, yyyy"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholderText="Pick a date"
                  />
                </div>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="end-date"
                  className="text-sm font-medium block mb-2"
                >
                  End Date
                </Label>
                <div className="w-full">
                  <DatePickerComponent
                    selected={endDate}
                    onChange={(date: Date | null) =>
                      setEndDate(date ?? undefined)
                    }
                    dateFormat="MMMM d, yyyy"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholderText="Pick a date"
                  />
                </div>
              </div>
            </div>

            {/* Start and End Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <Label
                  htmlFor="start-time"
                  className="text-sm font-medium block mb-2"
                >
                  Start Time
                </Label>
                <div className="flex items-center border rounded-md px-3 py-2 w-full">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <Calendar
                    key={`start-time-${eventId}-${open}-${data?.event?.updatedAt}`}
                    id="start-time"
                    value={localStartTime}
                    onChange={handleStartTimeChange}
                    timeOnly
                    hourFormat="12"
                    className="w-full border-none p-0"
                    inputClassName="border-none p-0 h-6 text-sm focus:outline-none w-full"
                    panelStyle={{ fontSize: "0.875rem" }}
                    style={{ height: "22px", width: "100%" }}
                  />
                </div>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="end-time"
                  className="text-sm font-medium block mb-2"
                >
                  End Time
                </Label>
                <div className="flex items-center border rounded-md px-3 py-2 w-full">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <Calendar
                    key={`end-time-${eventId}-${open}-${data?.event?.updatedAt}`}
                    id="end-time"
                    value={localEndTime}
                    onChange={handleEndTimeChange}
                    timeOnly
                    hourFormat="12"
                    className="w-full border-none p-0"
                    inputClassName="border-none p-0 h-6 text-sm focus:outline-none w-full"
                    panelStyle={{ fontSize: "0.875rem" }}
                    style={{ height: "22px", width: "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Client Selection */}
            <div>
              <Label
                htmlFor="client"
                className="text-sm font-medium block mb-1"
              >
                Client
              </Label>
              <Select
                value={selectedClientId}
                onValueChange={setSelectedClientId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clientsLoading ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading clients...
                      </div>
                    </SelectItem>
                  ) : clientsData?.clients?.length ? (
                    clientsData.clients.map((client) => (
                      <SelectItem key={client.userId} value={client.userId}>
                        {client.userName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-clients" disabled>
                      No clients available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isUpdating ? "Updating..." : "Update Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
