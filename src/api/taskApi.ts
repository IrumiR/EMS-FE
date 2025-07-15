import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import authFetch from "./authInterceptor";

export interface CreateTaskData {
  taskName: string;
  taskDescription?: string;
  startDate: string;
  endDate: string;
  status?: "To Do" | "InProgress" | "Completed" | "Over Due" | "Cancelled";
  priority?: "Low" | "Medium" | "High";
  assignees?: {
    assigneeId?: string;
    role: "manager" | "team-member";
  }[];
  inventoryItems?: string[];
  eventId: string;
 subTasks?: {
    subTaskName: string;
  }[];
  comments?: {
    commentId?: string;
    userId?: string;
    attachments?: string[];
    isChangeRequest?: boolean;
  }[];
  feedback?: {
    feedbackId?: string;
  }[];
  createdBy: string;
}

export const useCreateTask = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskData: CreateTaskData) => {
      const response = await authFetch.post("/tasks/create", taskData);
      return response.data;
    },
    onSuccess(data) {
      onSuccess("Task created successfully");
      queryClient.invalidateQueries(["get_all_by_event_tasks"]);
       queryClient.invalidateQueries("user_notifications");
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Task creation failed";
      onError(message);
    },
  });
};

export interface Task {
  _id: string;
  taskName: string;
  taskDescription?: string;
  startDate: string;
  endDate: string;
  status?: "To Do" | "InProgress" | "Completed" | "Over Due" | "Cancelled";
  priority?: "Low" | "Medium" | "High";
  assignees?: {
    assigneeId?: string;
  }[];
  inventoryItems?: string[];
  eventId: string;
  subTasks?: {
    subTaskName: string;
    status?: string;
  }[];
  comments?: {
    commentId?: string;
    userId?: string;
    attachments?: string[];
    isChangeRequest?: boolean;
  }[];
  feedback?: {
    feedbackId?: string;
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TaskPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskResponse {
  message: string;
  tasks: Task[];
  pagination: TaskPagination;
}

export const useGetAllTasksByEventId = (
  eventId: string,
  page?: number,
  pageSize?: number,
  search?: string,
  status?: string
): UseQueryResult<TaskResponse> => {
  return useQuery({
    queryKey: [
      "get_all_by_user_tasks", // "get_all_by_event_tasks" 
      eventId,
      page,
      pageSize,
      search,
      status,
    ],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (page !== undefined) params.append("page", page.toString());
        if (pageSize !== undefined) params.append("limit", pageSize.toString());
        if (search) params.append("search", search);
        if (status) params.append("status", status);

        const response = await authFetch.get<TaskResponse>(
          `/tasks/all-by-event/${eventId}?${params.toString()}`
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Tasks retrieved successfully");
    },
    onError: (error) => {
      console.error("Fetch error:", error);
    },
  });
};

export const useGetAllTasksByUserId = (
  page?: number,
  pageSize?: number,
  search?: string,
  status?: string,
  eventId?: string
): UseQueryResult<TaskResponse> => {
  return useQuery({
    queryKey: ["get_all_by_user_tasks", page, pageSize, search, status, eventId],

    queryFn: async () => {
      const userType = localStorage.getItem("role");
      const userId = localStorage.getItem("userId");

      const params = new URLSearchParams();
      if (page !== undefined) params.append("page", page.toString());
      if (pageSize !== undefined) params.append("limit", pageSize.toString());
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (eventId) params.append("eventId", eventId);

      // Include userId as a query param if not admin
      if (userType !== "admin" && userId) {
        params.append("userId", userId);
      }

      const endpoint = `/tasks/all?${params.toString()}`;

      try {
        const response = await authFetch.get<TaskResponse>(endpoint);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    onSuccess: () => {
      console.log("Tasks retrieved successfully");
    },
    onError: (error) => {
      console.error("Fetch error:", error);
    },
  });
};

export const useGetTaskById = (
  taskId: string | null,
  enabled: boolean = true
) => {
  return useQuery(
    ["get_task_by_id", taskId],
    async () => {
      if (!taskId) return null;
      const response = await authFetch.get(`/tasks/${taskId}`);
      return response.data;
    },
    {
      enabled: !!taskId && enabled,
    }
  );
};

export interface TaskData {
  taskName: string;
  taskDescription?: string;
  startDate: string;
  endDate: string;
  status?: "To Do" | "InProgress" | "Completed" | "Over Due" | "Cancelled";
  priority?: "Low" | "Medium" | "High";
  assignees?: {
    assigneeId?: string;
  }[];
  inventoryItems?: string[];
  eventId: string;
  subTasks?: {
    subTaskName: string;
    status?: string;
  }[];
  comments?: {
    commentId?: string;
    userId?: string;
    attachments?: string[];
    isChangeRequest?: boolean;
  }[];
  feedback?: {
    feedbackId?: string;
  }[];
}

export const useUpdateTask = (
  onSuccess: (data: any) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      taskData,
    }: {
      taskId: string;
      taskData: Partial<TaskData>;
    }) => {
      const response = await authFetch.put(`/tasks/${taskId}`, taskData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("tasks");
      queryClient.invalidateQueries(["task", data.task._id]);
      queryClient.invalidateQueries("get_all_by_event_tasks")
      queryClient.invalidateQueries("user_notifications");
      if (onSuccess) onSuccess(data);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Failed to update task";
      if (onError) onError(message);
    },
  });
};

export interface EventsListResponse {
  message: string;
  events: EventsOption[];
}

export interface EventsOption {
  _id: string;
  eventName: string;
}

export const useGetAllEventsDropdown = (
  clientId?: string
): UseQueryResult<EventsListResponse> => {
  return useQuery({
    queryKey: ["events_options", clientId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (clientId) {
        params.append("clientId", clientId);
      }

      const endpoint = `/events/dropdown/events${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      try {
        const response = await authFetch.get<EventsListResponse>(endpoint);
        return {
          message: response.data.message,
          events: response.data.events,
        };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Event options retrieved successfully");
    },
    onError: (error) => {
      console.error("Event options fetch error:", error);
    },
  });
};


export interface TaskStatusApprove {
  status: string;
}  

export const useApproveTask = (
  onSuccess: (data: any) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: Partial<TaskStatusApprove>;
    }) => {
      const response = await authFetch.put(`/tasks/status/${taskId}`, status);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_all_by_user_tasks");
      if (onSuccess) onSuccess(data);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Failed to update task";
      if (onError) onError(message);
    },
  });
};

export interface TaskPriorityApprove {
  priority: string;
}

export const useApproveTaskPriority = (
  onSuccess: (data: any) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      priority,
    }: {
      taskId: string;
      priority: Partial<TaskPriorityApprove>;
    }) => {
      const response = await authFetch.put(`/tasks/priority/${taskId}`, priority);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("get_all_by_user_tasks");
      if (onSuccess) onSuccess(data);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Failed to update task";
      if (onError) onError(message);
    },
  });
};

export const useDeleteTask = (onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await authFetch.delete(`/tasks/${taskId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("get_all_by_user_tasks");
      onSuccess();
    },
    onError: () => {
      onError();
    },
  });
};

interface CalendarTask {
  taskName: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  eventName: string;
}

interface MonthlyTasksResponse {
  message: string;
  tasks: {
    [date: string]: CalendarTask[];
  };
}


export const useGetAllTasksByMonth = (
  year: number,
  month: number,
  userId?: string,
  clientId?: string
): UseQueryResult<MonthlyTasksResponse> => {
  return useQuery({
    queryKey: ["get_monthly_tasks", year, month, userId, clientId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("year", year.toString());
      params.append("month", month.toString());
      if (userId) params.append("userId", userId);
      if (clientId) params.append("clientId", clientId);

      const response = await authFetch.get<MonthlyTasksResponse>(
        `/tasks/monthly?${params.toString()}`
      );

      return response.data;
    },
    onSuccess: () => {
      console.log("Monthly tasks retrieved successfully");
    },
    onError: (error) => {
      console.error("Error fetching monthly tasks:", error);
    },
  });
};

