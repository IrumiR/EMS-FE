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
import { useGetEventById } from "@/api/eventApi";
import { useState } from "react";
import { Clock } from "lucide-react";
import DatePickerComponent from "../atoms/datePicker";

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
}: UpdateEventDialogProps) {
  const { data, isLoading } = useGetEventById(open ? eventId : null);
  const event = data?.event;

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    status: "",
    description: "",
    location: "",
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
    client: "",
    quotation: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const eventTypes = [
    "wedding",
    "birthday",
    "concert",
    "conference",
    "sports",
    "charity",
    "corporate",
    "others",
  ];
  const statuses = [
    "pending approval",
    "approved",
    "in progress",
    "hold",
    "completed",
    "cancelled",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Event</DialogTitle>
          <DialogDescription>
            Edit information for event: {title}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="eventName"
              className="text-sm font-medium block mb-3"
            >
              Event Title
            </Label>
            <Input
              placeholder="Event Name"
              value={formData.eventName}
              onChange={(e) => handleChange("eventName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <Label
                htmlFor="eventType"
                className="text-sm font-medium block mb-3"
              >
                Event Type
              </Label>
              <Select
                onValueChange={(value) => handleChange("eventType", value)}
              >
                <SelectTrigger>
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
            </div>

            <div className="">
              <Label
                htmlFor="eventStatus"
                className="text-sm font-medium block mb-3"
              >
                Event Status
              </Label>
              <Select onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
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
            </div>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium block mb-3"
            >
              Description
            </Label>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div>
            <Label
              htmlFor="location"
              className="text-sm font-medium block mb-3"
            >
              Location
            </Label>
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="start-date"
                className="text-sm font-medium block mb-1"
              >
                Start Date
              </Label>
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
            <div>
              <Label
                htmlFor="end-date"
                className="text-sm font-medium block mb-1"
              >
                End Date
              </Label>
              <DatePickerComponent
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date ?? undefined)}
                dateFormat="MMMM d, yyyy"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholderText="Pick a date"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="start-time"
                className="text-sm font-medium block mb-1"
              >
                Start Time
              </Label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <Calendar
                  id="start-time"
                  value={startTime ?? null}
                  onChange={(e) => setStartTime(e.value ?? undefined)}
                  timeOnly
                  hourFormat="12"
                  className="w-full border-none p-0"
                  inputClassName="border-none p-0 h-6 text-sm focus:outline-none"
                  panelStyle={{ fontSize: "0.875rem" }}
                  style={{ height: "22px" }}
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="end-time"
                className="text-sm font-medium block mb-1"
              >
                End Time
              </Label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <Calendar
                  id="end-time"
                  value={endTime ?? null}
                  onChange={(e) => setEndTime(e.value ?? undefined)}
                  timeOnly
                  hourFormat="12"
                  className="w-full border-none p-0"
                  inputClassName="border-none p-0 h-6 text-sm focus:outline-none"
                  panelStyle={{ fontSize: "0.875rem" }}
                  style={{ height: "22px" }}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="client" className="text-sm font-medium block mb-3">
              Client
            </Label>
            <Input
              placeholder="Client"
              value={formData.client}
              onChange={(e) => handleChange("client", e.target.value)}
            />
          </div>
            <Label
                htmlFor="quotation"
                className="text-sm font-medium block mb-3"
              >
                Quotation
              </Label>
          <Input id="quotation" type="file" className="w-full" />
        </div>
        <DialogFooter>
          <Button type="submit">Update Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
