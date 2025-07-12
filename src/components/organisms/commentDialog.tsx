import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Send,
  Paperclip,
  CornerDownRight,
  X,
  Loader2,
  MessageCircle,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCommentData } from "@/hooks/commentHandler";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskName?: string;
}

export default function CommentDialog({
  open,
  onOpenChange,
  taskId,
  taskName = "Task",
}: CommentDialogProps) {
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showReplyFileUpload, setShowReplyFileUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedReplyFiles, setSelectedReplyFiles] = useState<File[]>([]);

  const {
    messagesWithReplies,
    replyingTo,
    isLoading,
    handleSendMessage,
    handleSendReply,
    handleDeleteMessage,
    handleForwardMessage,
    getParentMessage,
    setReplyingTo,
    isCreatingComment,
    isCreatingReply,
    isDeletingComment,
  } = useCommentData(taskId, open);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    isReply = false
  ) => {
    const files = Array.from(event.target.files || []);
    if (isReply) {
      setSelectedReplyFiles([...selectedReplyFiles, ...files]);
    } else {
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const removeFile = (index: number, isReply = false) => {
    if (isReply) {
      setSelectedReplyFiles(selectedReplyFiles.filter((_, i) => i !== index));
    } else {
      setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    }
  };

  const createImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const handleSendNewMessage = async () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
      await handleSendMessage(newMessage, selectedFiles);
      setNewMessage("");
      setSelectedFiles([]);
      setShowFileUpload(false);
    }
  };

  const handleSendNewReply = async () => {
    if ((replyMessage.trim() || selectedReplyFiles.length > 0) && replyingTo) {
      await handleSendReply(replyMessage, replyingTo, selectedReplyFiles);
      setReplyMessage("");
      setSelectedReplyFiles([]);
      setShowReplyFileUpload(false);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyMessage("");
    setSelectedReplyFiles([]);
    setShowReplyFileUpload(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - commentDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const displayComments = messagesWithReplies;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] h-[700px] p-0 flex flex-col">
        <DialogHeader className="p-6 flex-shrink-0 border-b">
          <DialogTitle className="text-xl font-semibold">
            Comments - {taskName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading comments...</span>
              </div>
            ) : displayComments.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No comments yet</p>
                <p className="text-sm">
                  Be the first to start the conversation!
                </p>
              </div>
            ) : (
              displayComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* Parent Comment */}
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {comment.sender.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.sender}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed mb-3">
                        {comment.content}
                      </p>

                      {/* Images */}
                      {comment.images && comment.images.length > 0 && (
                        <div
                          className={`${
                            comment.content ? "mt-2" : ""
                          } space-y-2`}
                        >
                          {comment.images?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {comment.images.map((imageUrl, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="relative group w-full max-w-[200px] rounded-lg overflow-hidden"
                                >
                                  <a
                                    href={imageUrl}
                                    download={`attachment-${imgIndex + 1}`}
                                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80 p-1 rounded-full shadow"
                                  >
                                    <Download className="w-4 h-4 text-gray-700 hover:text-green-600" />
                                  </a>

                                  <img
                                    src={imageUrl}
                                    alt={`Attachment ${imgIndex + 1}`}
                                    className="w-full h-auto object-cover rounded-lg transition-opacity duration-200 group-hover:opacity-75"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-medium text-gray-500 hover:text-blue-600 px-0"
                          onClick={() => handleForwardMessage(comment.id)}
                        >
                          <CornerDownRight className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-medium text-gray-500 hover:text-red-600 px-0"
                          onClick={() => handleDeleteMessage(comment.id)}
                          disabled={isDeletingComment}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-13 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                            {reply.sender.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-gray-900 text-sm">
                                {reply.sender}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-800 text-sm leading-relaxed mb-3">
                              {reply.content}
                            </p>

                            {/* Reply Images */}
                            {reply.images && reply.images.length > 0 && (
                              <div
                                className={`${
                                  reply.content ? "mt-2" : ""
                                } space-y-2`}
                              >
                                {reply.images.map((imageUrl, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="relative group w-full max-w-[200px] rounded-lg overflow-hidden"
                                  >
                                    <a
                                      href={imageUrl}
                                      download={`attachment-${imgIndex + 1}`}
                                      className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80 p-1 rounded-full shadow"
                                    >
                                      <Download className="w-4 h-4 text-gray-700 hover:text-green-600" />
                                    </a>

                                    <img
                                      src={imageUrl}
                                      alt={`Attachment ${imgIndex + 1}`}
                                      className="w-full h-auto object-cover rounded-lg transition-opacity duration-200 group-hover:opacity-75"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reply action buttons */}
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs font-medium text-gray-500 hover:text-blue-600 px-0"
                                onClick={() => handleForwardMessage(reply.id)}
                              >
                                <CornerDownRight className="w-4 h-4 mr-1" />
                                Reply
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs font-medium text-gray-500 hover:text-red-600 px-0"
                                onClick={() => handleDeleteMessage(reply.id)}
                                disabled={isDeletingComment}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Reply Input */}
          {replyingTo && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="mb-3 p-3 bg-white rounded-lg border-l-4 border-blue-500">
                <p className="text-xs text-gray-500 mb-1">Replying to:</p>
                <p className="text-sm text-gray-700">
                  {getParentMessage(replyingTo)?.content}
                </p>
              </div>

              {/* File Upload for Reply */}
              {showReplyFileUpload && (
                <div className="mb-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="reply-file-upload"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, true)}
                      className="hidden"
                    />
                    <label
                      htmlFor="reply-file-upload"
                      className="cursor-pointer block text-center"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Paperclip className="w-8 h-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Click to upload images or drag and drop
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Selected Files Preview */}
                  {selectedReplyFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedReplyFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={createImageUrl(file)}
                            alt={file.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                            onClick={() => removeFile(index, true)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full p-2 flex-shrink-0 ${
                    showReplyFileUpload
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setShowReplyFileUpload(!showReplyFileUpload)}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    !isCreatingReply &&
                    handleSendNewReply()
                  }
                  className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isCreatingReply}
                />
                <Button
                  onClick={handleSendNewReply}
                  size="sm"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white p-2 flex-shrink-0"
                  disabled={
                    (!replyMessage.trim() && selectedReplyFiles.length === 0) ||
                    isCreatingReply
                  }
                >
                  {isCreatingReply ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={handleCancelReply}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-gray-500 hover:text-gray-700 p-2 flex-shrink-0"
                  disabled={isCreatingReply}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Regular Message Input */}
          {!replyingTo && (
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              {showFileUpload && (
                <div className="mb-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="main-file-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="main-file-upload"
                      className="cursor-pointer block text-center"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Paperclip className="w-8 h-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Click to upload images or drag and drop
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={createImageUrl(file)}
                            alt={file.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full p-2 flex-shrink-0 ${
                    showFileUpload
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setShowFileUpload(!showFileUpload)}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Write a comment..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    !isCreatingComment &&
                    handleSendNewMessage()
                  }
                  className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isCreatingComment}
                />
                <Button
                  onClick={handleSendNewMessage}
                  size="sm"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white p-2 flex-shrink-0"
                  disabled={
                    (!newMessage.trim() && selectedFiles.length === 0) ||
                    isCreatingComment
                  }
                >
                  {isCreatingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
