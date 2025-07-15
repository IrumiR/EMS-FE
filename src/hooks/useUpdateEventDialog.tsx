import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format, parse } from "date-fns";
import { toast } from "react-hot-toast";
import { useGetEventById, useUpdateEvent } from "@/api/eventApi";
import { useGetClientOptions, useGetAssigneeOptions } from "@/api/authApi";
import { useGetInventoryOptions } from "@/api/inventoryApi";

interface UseUpdateEventDialogProps {
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
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  selectedAssignees: Array<{ name: string; id: string }>;
  setSelectedAssignees: (
    assignees: Array<{ name: string; id: string }>
  ) => void;
  selectedItems: Array<{ name: string; id: string }>;
  setSelectedItems: (items: Array<{ name: string; id: string }>) => void;
}

export const useUpdateEventDialog = ({
  eventId,
  open,
  onOpenChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setStartTime,
  setEndTime,
  selectedClientId,
  setSelectedClientId,
  selectedAssignees,
  setSelectedAssignees,
  selectedItems,
  setSelectedItems,
}: UseUpdateEventDialogProps) => {
  const [localStartTime, setLocalStartTime] = useState<Date | null>(null);
  const [localEndTime, setLocalEndTime] = useState<Date | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data, isLoading, isError } = useGetEventById(open ? eventId : null);
  const { data: clientsData, isLoading: clientsLoading } =
    useGetClientOptions();
  const { data: assigneesData, isLoading: assigneesLoading } =
    useGetAssigneeOptions();
  const { data: inventoryData, isLoading: inventoryLoading } =
    useGetInventoryOptions();

  const validationSchema = Yup.object({
    eventName: Yup.string().required("Event name is required"),
    eventType: Yup.string().required("Event type is required"),
    status: Yup.string().required("Status is required"),
    eventDescription: Yup.string(),
    location: Yup.string().required("Location is required"),
    client: Yup.string().required("Client is required"),
  });

  const onSuccess = () => {
    setIsDataLoaded(false);
    setLocalStartTime(null);
    setLocalEndTime(null);
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

  const formik = useFormik({
    initialValues: {
      eventName: "",
      eventType: "",
      status: "",
      eventDescription: "",
      location: "",
      client: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formattedStartDate = startDate
        ? format(startDate, "yyyy-MM-dd")
        : "";
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : "";
      const formattedStartTime = localStartTime
        ? format(localStartTime, "HH:mm:ss")
        : "";
      const formattedEndTime = localEndTime
        ? format(localEndTime, "HH:mm:ss")
        : "";

      const statusMap: Record<
        string,
        | "Pending Approval"
        | "Approved"
        | "In Progress"
        | "Hold"
        | "Completed"
        | "Cancelled"
      > = {
        "pending approval": "Pending Approval",
        approved: "Approved",
        "in progress": "In Progress",
        hold: "Hold",
        completed: "Completed",
        cancelled: "Cancelled",
      };

      updateEvent({
        eventId,
        eventData: {
          ...values,
          eventType: values.eventType ? [values.eventType] : [],
          status: statusMap[values.status] ?? undefined,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          clientId: selectedClientId,
          eventDescription: values.eventDescription || "",
          proposedLocation: values.location || "",
          assignees: selectedAssignees.map((a) => a.id),
          inventoryItems: selectedItems.map((i) => i.id),
        },
      });
    },
  });

  // Reset everything when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setIsDataLoaded(false);
      setLocalStartTime(null);
      setLocalEndTime(null);
      formik.resetForm();
      setSelectedAssignees([]);
      setSelectedItems([]);
    }
  }, [open]);

  // Load data when dialog opens and data is available
  useEffect(() => {
    if (open && data?.event && !isDataLoaded) {
      const event = data.event;

      // Set form values
      formik.setValues({
        eventName: event.eventName || "",
        eventType: Array.isArray(event.eventType) ? event.eventType[0] : "",
        status: event.status ? event.status.toLowerCase() : "",
        eventDescription: event.eventDescription || "",
        location: event.proposedLocation || "",
        client: event?.clientId?.userName || "",
      });

      // Set dates
      setStartDate(event.startDate ? new Date(event.startDate) : undefined);
      setEndDate(event.endDate ? new Date(event.endDate) : undefined);

      // Set start time
      if (event.startTime) {
        const startTimeDate = parse(event.startTime, "HH:mm:ss", new Date());
        if (!isNaN(startTimeDate.getTime())) {
          setLocalStartTime(startTimeDate);
          setStartTime(startTimeDate);
        }
      } else {
        setLocalStartTime(null);
        setStartTime(undefined);
      }

      // Set end time
      if (event.endTime) {
        const endTimeDate = parse(event.endTime, "HH:mm:ss", new Date());
        if (!isNaN(endTimeDate.getTime())) {
          setLocalEndTime(endTimeDate);
          setEndTime(endTimeDate);
        }
      } else {
        setLocalEndTime(null);
        setEndTime(undefined);
      }

      // Set selected client
      setSelectedClientId(event?.clientId?._id || "");

      // Handle assignees
      if (event.assignees && Array.isArray(event.assignees)) {
        const mappedAssignees = event.assignees.map((assignee: any) => ({
          name: assignee.userName || assignee.name,
          id: assignee._id || assignee.id,
        }));
        console.log("Setting assignees:", mappedAssignees);
        setSelectedAssignees(mappedAssignees);
      } else {
        console.log("No assignees found in event data");
        setSelectedAssignees([]);
      }

      // Handle inventory items
      if (event.inventoryItems && Array.isArray(event.inventoryItems)) {
        const mappedItems = event.inventoryItems.map((item: any) => ({
          name: item.itemName || item.name,
          id: item._id || item.id,
        }));
        console.log("Setting inventory items:", mappedItems);
        setSelectedItems(mappedItems);
      } else {
        console.log("No inventory items found in event data");
        setSelectedItems([]);
      }

      // Debug the full event data structure
      console.log("Full event data:", event);
      console.log("Event assignees:", event.assignees);
      console.log("Event inventory items:", event.inventoryItems);

      setIsDataLoaded(true);
    }
  }, [open, data, eventId, isDataLoaded]);

  const handleStartTimeChange = (e: any) => {
    const newTime = e.value;
    if (newTime && !isNaN(newTime.getTime())) {
      setLocalStartTime(newTime);
      setStartTime(newTime);
    }
  };

  const handleEndTimeChange = (e: any) => {
    const newTime = e.value;
    if (newTime && !isNaN(newTime.getTime())) {
      setLocalEndTime(newTime);
      setEndTime(newTime);
    }
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

  return {
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
    isDataLoaded,
    assigneesData,
    assigneesLoading,
    inventoryData,
    inventoryLoading,
  };
};
