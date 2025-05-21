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
