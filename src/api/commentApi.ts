import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
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
  images?: {
    _id: string;
    data: string; 
    contentType: string;
  }[];
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
  images?: {
    _id: string;
    data: string; // base64 string
    contentType: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export const createComment = (
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentData: Comment & { files?: File[] }) => {
      const formData = new FormData();
    
      formData.append("taskId", commentData.taskId);
      formData.append("commentText", commentData.commentText);
      formData.append("createdBy", commentData.createdBy._id); 
    
      if (commentData.files) {
        commentData.files.forEach((file) => {
          formData.append("images", file); 
        });
      }
    
      const response = await authFetch.post("/comments/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    
      return response.data;
    },
    
    onSuccess() {
      onSuccess("Comment added successfully");
      queryClient.invalidateQueries(["get_all_comments_by_task_id"]);
      queryClient.invalidateQueries(["user_notifications"]);
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
      files = [],
    }: {
      commentId: string;
      replyText: string;
      createdBy: string;
      files?: File[];
    }) => {
      const formData = new FormData();
      formData.append("replyText", replyText);
      formData.append("createdBy", createdBy);

      files.forEach((file) => {
        formData.append("images", file); 
      });

      const response = await authFetch.post(
        `/comments/${commentId}/reply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },

    onSuccess() {
      onSuccess("Reply added successfully");
      queryClient.invalidateQueries(["get_all_comments_by_task_id"]);
      queryClient.invalidateQueries(["user_notifications"]);
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
  taskId: string,
  options?: UseQueryOptions<CommentResponse>
): UseQueryResult<CommentResponse> => {
  return useQuery<CommentResponse>({
    queryKey: ["get_all_comments_by_task_id", taskId],
    queryFn: async () => {
      const response = await authFetch.get<CommentResponse>(
        `/comments/${taskId}`
      );
      return response.data;
    },
onSuccess: () => {
      console.log("Comments retrieved successfully");
    },
    onError: (error) => {
      console.error("Error fetching comments:", error);
    },
    ...options, // Spread in custom options like `enabled`
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

