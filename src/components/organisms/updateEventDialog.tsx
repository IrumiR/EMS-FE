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
import { useGetEventById, useUpdateEvent } from "@/api/eventApi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect} from "react";
import { Clock } from "lucide-react";
import DatePickerComponent from "../atoms/datePicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

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
const { data, isLoading, isError } = useGetEventById(open ? eventId : null);

const onSuccess = () => {
  onOpenChange(false);
  toast.success("Event updated successfully!", {
    id: "success-toast",
    position: "top-center",
    duration: 3000,
  });
};

  const onError = (message: string) => {
    formik.setSubmitting(false);
    toast.error(message, {
      id: "error-toast",
      position: "top-center",
      duration: 4000,
    });
  };


  const { mutate: updateEvent, isLoading: isUpdating } = useUpdateEvent(
    onSuccess,
    onError
  );

  const validationSchema = Yup.object({
    eventName: Yup.string().required("Event name is required"),
    eventType: Yup.string().required("Event type is required"),
    status: Yup.string().required("Status is required"),
    description: Yup.string(),
    location: Yup.string().required("Location is required"),
    client: Yup.string().required("Client is required"),
  });

  const formik = useFormik({
    initialValues: {
      eventName: "",
      eventType: "",
      status: "",
      description: "",
      location: "",
      client: "",
      quotation: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formattedStartDate = startDate
        ? format(startDate, "yyyy-MM-dd")
        : "";
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : "";
      const formattedStartTime = startTime ? format(startTime, "HH:mm:ss") : "";
      const formattedEndTime = endTime ? format(endTime, "HH:mm:ss") : "";
      const statusMap: Record<string, "Pending Approval" | "Approved" | "InProgress" | "Hold" | "Completed" | "Cancelled"> = {
        "pending approval": "Pending Approval",
        "approved": "Approved",
        "in progress": "InProgress",
        "hold": "Hold",
        "completed": "Completed",
        "cancelled": "Cancelled",
      };

      updateEvent(
        {
          eventId,
          eventData: {
            ...values,
            eventType: values.eventType ? [values.eventType] : [],
            status: statusMap[values.status] ?? undefined,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          },
        },
        {
       
        }
      );
    },
  });

 
 useEffect(() => {
  if (data?.event) {
    const event = data.event;
    formik.setValues({
      eventName: event.eventName || "",
      eventType: Array.isArray(event.eventType) ? event.eventType[0] : "",
      status: event.status ? event.status.toLowerCase() : "",
      description: event.eventDescription || "", 
      location: event.proposedLocation || "", 
      client: event?.clientId?.userName || "",
      quotation: event.quotation || "",
    });

    
  }
}, [data, setStartDate, setEndDate, setStartTime, setEndTime]);

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
      <DialogContent className="max-w-md max-h-[100vh]">
        <ScrollArea className="max-h-[80vh] pr-4">
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
            <DialogDescription>
              Edit information for event: {title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
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
              {formik.touched.eventName && formik.errors.eventName ? (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.eventName}
                </p>
              ) : null}
            </div>

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
                {formik.touched.eventType && formik.errors.eventType ? (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.eventType}
                  </p>
                ) : null}
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
                {formik.touched.status && formik.errors.status ? (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.status}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium block mb-2"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

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
              {formik.touched.location && formik.errors.location ? (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.location}
                </p>
              ) : null}
            </div>

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
                    id="start-time"
                    value={startTime ?? null}
                    onChange={(e) => setStartTime(e.value ?? undefined)}
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
                    id="end-time"
                    value={endTime ?? null}
                    onChange={(e) => setEndTime(e.value ?? undefined)}
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

            <div>
              <Label
                htmlFor="client"
                className="text-sm font-medium block mb-2"
              >
                Client
              </Label>
              <Input
                id="client"
                name="client"
                placeholder="Client"
                value={formik.values.client}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.client && formik.errors.client
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.client && formik.errors.client ? (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.client}
                </p>
              ) : null}
            </div>

            <div>
              <Label
                htmlFor="quotation"
                className="text-sm font-medium block mb-2"
              >
                Quotation
              </Label>
              <Input
                id="quotation"
                name="quotation"
                type="file"
                className="w-full"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) {
                    formik.setFieldValue("quotation", file);
                  }
                }}
              />
            </div>
          </form>
        </ScrollArea>
        <DialogFooter className="">
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
