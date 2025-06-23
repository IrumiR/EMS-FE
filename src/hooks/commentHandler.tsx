import { useState, useEffect } from 'react';
import { 
  useGetAllCommentsByTaskId, 
  createComment, 
  addReplyToComment, 
  deleteComment,
  Comment,
} from '../api/commentApi';
import { toast } from 'react-hot-toast'; 

export interface CommentMessage {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isReply?: boolean;
  images?: string[];
  parentId?: string;
  originalCommentId?: string;
  originalReplyId?: string;
}

export const useCommentData = (taskId: string, isOpen: boolean) => {
  const [messages, setMessages] = useState<CommentMessage[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // API hooks
 const {
    data: commentsData,
    isLoading,
    refetch,
  } = useGetAllCommentsByTaskId(taskId, {
    enabled: isOpen,
  });
   console.log(commentsData, "commentsData");

  const createCommentMutation = createComment(
    (message) => {
      toast.success(message);
      refetch();
    },
    (error) => {
      toast.error(error);
    }
  );

  const addReplyMutation = addReplyToComment(
    (message) => {
      toast.success(message);
      refetch();
    },
    (error) => {
      toast.error(error);
    }
  );

  const deleteCommentMutation = deleteComment(
    () => {
      toast.success('Comment deleted successfully');
      refetch();
    },
    (error) => {
      toast.error(error);
    }
  );

  const transformCommentsToMessages = (comments: Comment[]): CommentMessage[] => {
    const messages: CommentMessage[] = [];
    
    comments.forEach((comment) => {
      const mainMessage: CommentMessage = {
        id: comment._id || `temp-${Date.now()}`,
        sender: comment.createdBy.userName,
        avatar: "/api/placeholder/40/40",
        content: comment.commentText,
        timestamp: comment.createdAt
          ? new Date(comment.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        isReply: false,
        originalCommentId: comment._id,
        images:
          comment.images?.map(
            (img) => `data:${img.contentType};base64,${img.data}`
          ) || [],
      };
      messages.push(mainMessage);

      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply) => {
          const replyMessage: CommentMessage = {
            id: reply._id || `temp-reply-${Date.now()}`,
            sender: reply.createdBy.userName || "Unknown",
            avatar: "/api/placeholder/40/40",
            content: reply.commentText,
            timestamp: reply.createdAt
              ? new Date(reply.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            isReply: true,
            parentId: mainMessage.id,
            originalCommentId: comment._id,
            originalReplyId: reply._id,
            images:
              reply.images?.map(
                (img) => `data:${img.contentType};base64,${img.data}`
              ) || [],
          };
          messages.push(replyMessage);
        });
      }
    });

    return messages;
  };

  // Update messages when API data changes
 useEffect(() => {
    if (Array.isArray(commentsData)) {
      const transformedMessages = transformCommentsToMessages(commentsData);
      setMessages(transformedMessages);
    }
  }, [commentsData]);
 

  // Fetch comments when dialog opens
  useEffect(() => {
    if (isOpen && taskId) {
      refetch();
    }
  }, [isOpen, taskId, refetch]);

  const handleSendMessage = async (content: string, files: File[] = []) => {
    if (!content.trim() && files.length === 0) return;

    try {
      const currentUser = localStorage.getItem(`userId`) || "current-user-id";
      const userName = localStorage.getItem(`userName`) || "You";

      const commentData: Comment & { files?: File[] } = {
        taskId,
        commentText: content,
        createdBy: {
          _id: currentUser,
          userName,
        },
        files,
      };

      await createCommentMutation.mutateAsync(commentData);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  

  const handleSendReply = async (content: string, parentMessageId: string, files: File[] = []) => {
    if (!content.trim() && files.length === 0) return;

    try {
      // Find the parent message to get the original comment ID
      const parentMessage = messages.find(msg => msg.id === parentMessageId);
      const originalCommentId = parentMessage?.originalCommentId;
      
      if (!originalCommentId) {
        toast.error('Cannot find parent comment');
        return;
      }

      const currentUser = localStorage.getItem(`userId`) || "current-user-id";
      
      await addReplyMutation.mutateAsync({
        commentId: originalCommentId,
        replyText: content,
        createdBy: currentUser,
        files,
      });

      setReplyingTo(null);
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const message = messages.find(msg => msg.id === messageId);
      
      if (!message) return;

      // If it's a reply, we need to delete the reply
      if (message.isReply && message.originalReplyId) {
        await deleteCommentMutation.mutateAsync(message.originalReplyId);
      } else if (message.originalCommentId) {
        await deleteCommentMutation.mutateAsync(message.originalCommentId);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleForwardMessage = (messageId: string) => {
    setReplyingTo(messageId);
  };

  const getParentMessage = (parentId: string) => {
    return messages.find(msg => msg.id === parentId);
  };

  const getMessageWithReplies = () => {
    const topLevelMessages = messages.filter(msg => !msg.parentId);
    const replies = messages.filter(msg => msg.parentId);
    
    const result: (CommentMessage & { replies?: CommentMessage[] })[] = [];
    
    topLevelMessages.forEach(msg => {
      const messageReplies = replies.filter(reply => reply.parentId === msg.id);
      result.push({ ...msg, replies: messageReplies });
    });
    
    return result;
  };

  return {
    messages,
    messagesWithReplies: getMessageWithReplies(),
    replyingTo,
    isLoading,
    handleSendMessage,
    handleSendReply,
    handleDeleteMessage,
    handleForwardMessage,
    getParentMessage,
    setReplyingTo,
    isCreatingComment: createCommentMutation.isLoading,
    isCreatingReply: addReplyMutation.isLoading,
    isDeletingComment: deleteCommentMutation.isLoading
  };
};

// Helper function to get current user
const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    id: user._id || user.id || 'current-user-id',
    userName: user.userName || user.name || 'You'
  };
};