import { useMutation, useQuery, useQueryClient, UseQueryResult } from "react-query";
import authFetch from "./authInterceptor";

export interface CreateEventData {
  eventName: string;
  eventType: string[];
  eventDescription?: string;
  eventImage?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
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

export interface Event {
  _id: string;
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
  startTime?: string;
  endTime?: string;
  progress?: number;
   createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EventPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventResponse {
  message: string;
  events: Event[];
  pagination: EventPagination;
}

export const useGetAllEvents = (
  page?: number,
  pageSize?: number,
  search?: string
): UseQueryResult<EventResponse> => {
  return useQuery({
    queryKey: ["get_all_events", page, pageSize, search],
    queryFn: async () => {
      try {
        const response = await authFetch.get<EventResponse>(
          `/events/all?limit=${pageSize ?? 10}&page=${page ?? 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Events retrieved successfully");
    },
    onError: (error) => {
      console.error("Fetch error:", error);
    },
  });
};

export const useGetEventById = (eventId: string | null) => {
  return useQuery(["get_event_by_id", eventId], async () => {
    if (!eventId) return null;
    const response = await authFetch.get(`/events/${eventId}`);
    return response.data;
  }, {
    enabled: !!eventId, 
  });
};

export interface EventData {
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
  startTime?: string;
  endTime?: string;
  progress?: number;
}

export const useUpdateEvent = (
  onSuccess: (data: any) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, eventData }: { eventId: string, eventData: Partial<EventData> }) => {
      const response = await authFetch.put(`/events/${eventId}`, eventData);
      return response.data;
    },
    onSuccess: (data) => {
       queryClient.invalidateQueries("events");
      queryClient.invalidateQueries(["event", data.event._id]);
      if (onSuccess) onSuccess(data);
    },
    onError(error) {
      const message = (error as any)?.response?.data?.message || "Failed to update event";
      if (onError) onError(message);
    },
  });
}

export interface EventApprove {
  status: string;
}

export const useApproveEvent = (
  onSuccess: (data: any) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      status,
    }: {
      eventId: string;
      status: Partial<EventApprove>;
    }) => {
      const response = await authFetch.put(`/events/status/${eventId}`, status);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_all_events");
      if (onSuccess) onSuccess(data);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Failed to update event";
      if (onError) onError(message);
    },
  });
};