import { useMutation } from "react-query";
import authFetch from "./authInterceptor";

export interface CreateEventData {
  eventName: string;
  eventType: string[];
  eventDescription?: string;
  eventImage?: string;
  startDate: string;
  endDate: string;
  proposedLocation?: string;
  status?: "Pending Approval" | "Approved" | "InProgress" | "Hold" | "Completed" | "Cancelled";
  clientId: string;
  quotationId?: string;
  feedbackId?: string;
  assignees?: string[];
  tasks?: {
    taskName: string;
    assigneeId?: string;
    commentId?: string;
  }[];
  inventoryItems?: string[];
  createdBy: string;
}

export const useCreateEvent = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  return useMutation({
    mutationFn: async (eventData: CreateEventData) => {
      const response = await authFetch.post("/events/create", eventData);
      return response.data;
    },
    onSuccess(data) {
      onSuccess("Event created successfully");
    },
    onError(error) {
      const message = (error as any)?.response?.data?.message || "Event creation failed";
      onError(message);
    },
  });
};