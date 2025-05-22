import { useMutation, useQuery, useQueryClient, UseQueryResult } from "react-query";
import authFetch from "./authInterceptor";


export interface CreateTaskData {
  taskName: string;
  taskDescription?: string;
  startDate: string;
  endDate: string;
  status?: 'To Do' | 'InProgress' | 'Completed' | 'Over Due' | 'Cancelled';
  priority?: 'Low' | 'Medium' | 'High';
  assignees?: {
    assigneeId?: string;
    role: 'manager' | 'team-member';
  }[];
  inventoryItems?: string[];
  eventId: string;
  subTasks?: string[];
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
  return useMutation({
    mutationFn: async (taskData: CreateTaskData) => {
      const response = await authFetch.post("/tasks/create", taskData);
      return response.data;
    },
    onSuccess(data) {
      onSuccess("Task created successfully");
    },
    onError(error) {
      const message = (error as any)?.response?.data?.message || "Task creation failed";
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
  status?: 'To Do' | 'InProgress' | 'Completed' | 'Over Due' | 'Cancelled';
  priority?: 'Low' | 'Medium' | 'High';
  assignees?: {
    assigneeId?: string;
  }[];
  inventoryItems?: string[];
  eventId: string;
  subTasks?: string[];
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
  search?: string
): UseQueryResult<TaskResponse> => {
  return useQuery({
    queryKey: ["get_all_tasks", page, pageSize, search],
    queryFn: async () => {
      try {
        const response = await authFetch.get<TaskResponse>(
          `/tasks/all/${eventId}?page=${page}&pageSize=${pageSize}&search=${search}`
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

export const useGetAllTasks = (
  page?: number,
  pageSize?: number,
  search?: string
): UseQueryResult<TaskResponse> => {
  return useQuery({
    queryKey: ["get_all_tasks", page, pageSize, search],
    queryFn: async () => {
      try {
        const response = await authFetch.get<TaskResponse>(
          `/tasks/all?limit=${pageSize ?? 10}&page=${page ?? 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`
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

export const useGetTaskById = (taskId: string | null) => {
  return useQuery(["get_task_by_id", taskId], async () => {
    if (!taskId) return null;
    const response = await authFetch.get(`/tasks/${taskId}`);
    return response.data;
  }, {
    enabled: !!taskId, 
  });
};

export interface TaskData {
  taskName: string;
  taskDescription?: string;
  startDate: string;
  endDate: string;
  status?: 'To Do' | 'InProgress' | 'Completed' | 'Over Due' | 'Cancelled';
  priority?: 'Low' | 'Medium' | 'High';
  assignees?: {
    assigneeId?: string;
  }[];
  inventoryItems?: string[];
  eventId: string;
  subTasks?: string[];
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
    mutationFn: async ({ taskId, taskData }: { taskId: string, taskData: Partial<TaskData> }) => {
      const response = await authFetch.put(`/tasks/${taskId}`, taskData);
      return response.data;
    },
    onSuccess: (data) => {
       queryClient.invalidateQueries("tasks");
      queryClient.invalidateQueries(["task", data.task._id]);
      if (onSuccess) onSuccess(data);
    },
    onError(error) {
      const message = (error as any)?.response?.data?.message || "Failed to update task";
      if (onError) onError(message);
    },
  });
}