import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import authFetch from "./authInterceptor";

export interface Reply {
  _id?: string;
  commentText: string;  // Change from replyText
  createdBy: {
    _id: string;
    userName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}


export interface Comment {
  _id?: string;
  taskId: string;
  commentText: string;
  createdBy: {
    _id: string;
    userName: string;
  };
  replies?: Reply[];
  createdAt?: string;
  updatedAt?: string;
}

export const createComment = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentData: Comment) => {
      const response = await authFetch.post("/comments/create", commentData);
      return response.data;
    },
    onSuccess(data) {
      onSuccess("Comment added successfully");
      queryClient.invalidateQueries(["get_all_comments_by_task_id"]);
    },
    onError(error) {
      const message = (error as any)?.response?.data?.message || "Failed to add a comment";
      onError(message);
    },
  });
};

export const addReplyToComment = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      replyText,
      createdBy,
    }: {
      commentId: string;
      replyText: string;
      createdBy: string;
    }) => {
      const response = await authFetch.post(`/comments/${commentId}/reply`, {
        commentText: replyText,  // 👈 Match backend param
        createdBy,
      });
      return response.data;
    },
    onSuccess(data) {
      onSuccess("Reply added successfully");
      queryClient.invalidateQueries(["get_all_comments_by_task_id"]);
    },
    onError(error) {
      const message =
        (error as any)?.response?.data?.message || "Failed to add a reply";
      onError(message);
    },
  });
};


export interface CommentResponse {
  message: string;
  comments: Comment[];
}

export const useGetAllCommentsByTaskId = (
  taskId: string
): UseQueryResult<CommentResponse> => {
  return useQuery({
    queryKey: ["get_all_comments_by_task_id", taskId],
    queryFn: async () => {
      try {
        const response = await authFetch.get<CommentResponse>(`/comments/${taskId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Comments retrieved successfully");
    },
    onError: (error) => {
      console.error("Error fetching comments:", error);
    },
  });
};

export const deleteComment = (
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await authFetch.delete(`/comments/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["get_all_comments_by_task_id"]);
      onSuccess();
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.message || "Failed to delete comment";
      onError(message);
    },
  });
};

