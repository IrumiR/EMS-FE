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
  console.log(messagesWithReplies, "messagesWithReplies");

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] h-[600px] p-0 flex flex-col">
        <DialogHeader className="p-4 flex-shrink-0">
          <DialogTitle>Comments - {taskName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading comments...</span>
              </div>
            ) : messagesWithReplies.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No comments yet</p>
              </div>
            ) : (
              messagesWithReplies.map((message) => (
                <div key={message.id} className="space-y-2">
                  {/* Parent Message */}
                  <div className="group">
                    <div
                      className={`flex ${
                        message.isReply ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] ${
                          message.isReply ? "flex-row-reverse" : "flex-row"
                        } space-x-2`}
                      >
                        <div
                          className={`flex flex-col ${
                            message.isReply ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              message.isReply
                                ? "bg-green-600 text-white rounded-br-md"
                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                            }`}
                          >
                            {message.content && (
                              <p className="text-sm leading-relaxed">
                                {message.content}
                              </p>
                            )}
                            {message.images && message.images.length > 0 && (
                              <div
                                className={`${
                                  message.content ? "mt-2" : ""
                                } space-y-2`}
                              >
                                {message.images?.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {message.images.map(
                                      (imageUrl, imgIndex) => (
                                        <div
                                          key={imgIndex}
                                          className="relative group w-full max-w-[200px] rounded-lg overflow-hidden"
                                        >
                                          <a
                                            href={imageUrl}
                                            download={`attachment-${
                                              imgIndex + 1
                                            }`}
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
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-2">
                            <span className="text-xs text-gray-500">
                              {message.sender}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div
                      className={`flex ${
                        message.isReply ? "justify-end" : "justify-start"
                      } mt-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <div className="flex space-x-1 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                          onClick={() => handleForwardMessage(message.id)}
                          disabled={isCreatingReply}
                        >
                          <CornerDownRight className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteMessage(message.id)}
                          disabled={isDeletingComment}
                        >
                          {isDeletingComment ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {message.replies && message.replies.length > 0 && (
                    <div className="ml-4 sm:ml-8 space-y-2">
                      {message.replies.map((reply) => {
                        const parentMsg = getParentMessage(reply.parentId!);
                        return (
                          <div key={reply.id} className="group">
                            <div
                              className={`flex ${
                                reply.isReply ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`flex max-w-[80%] ${
                                  reply.isReply
                                    ? "flex-row-reverse"
                                    : "flex-row"
                                } space-x-2`}
                              >
                                <div
                                  className={`flex flex-col ${
                                    reply.isReply ? "items-end" : "items-start"
                                  }`}
                                >
                                  <div
                                    className={`rounded-2xl px-4 py-2 ${
                                      reply.isReply
                                        ? "bg-green-600 text-white rounded-br-md"
                                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                                    }`}
                                  >
                                    {parentMsg && (
                                      <div
                                        className={`mb-2 pb-2 border-b ${
                                          reply.isReply
                                            ? "border-green-400 border-opacity-50"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        <p
                                          className={`text-xs ${
                                            reply.isReply
                                              ? "text-green-200"
                                              : "text-gray-500"
                                          } mb-1`}
                                        >
                                          {parentMsg.sender}
                                        </p>
                                        <p
                                          className={`text-xs ${
                                            reply.isReply
                                              ? "text-green-100"
                                              : "text-gray-600"
                                          } leading-relaxed`}
                                        >
                                          {parentMsg.content}
                                        </p>
                                      </div>
                                    )}
                                    {reply.content && (
                                      <p className="text-sm leading-relaxed">
                                        {reply.content}
                                      </p>
                                    )}
                                    {reply.images &&
                                      reply.images.length > 0 && (
                                        <div
                                          className={`${
                                            reply.content ? "mt-2" : ""
                                          } space-y-2`}
                                        >
                                          {reply.images.map(
                                            (imageUrl, imgIndex) => (
                                              <div
                                                key={imgIndex}
                                                className="relative group w-full max-w-[200px] rounded-lg overflow-hidden"
                                              >
                                                <a
                                                  href={imageUrl}
                                                  download={`attachment-${
                                                    imgIndex + 1
                                                  }`}
                                                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80 p-1 rounded-full shadow"
                                                >
                                                  <Download className="w-4 h-4 text-gray-700 hover:text-green-600" />
                                                </a>

                                                <img
                                                  src={imageUrl}
                                                  alt={`Attachment ${
                                                    imgIndex + 1
                                                  }`}
                                                  className="w-full h-auto object-cover rounded-lg transition-opacity duration-200 group-hover:opacity-75"
                                                />
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1 px-2">
                                    <span className="text-xs text-gray-500">
                                      {reply.sender}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      •
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {reply.timestamp}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Reply action buttons */}
                            <div
                              className={`flex ${
                                reply.isReply ? "justify-end" : "justify-start"
                              } mt-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                            >
                              <div className="flex space-x-1 px-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                                  onClick={() => handleForwardMessage(reply.id)}
                                  disabled={isCreatingReply}
                                >
                                  <CornerDownRight className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                                  onClick={() => handleDeleteMessage(reply.id)}
                                  disabled={isDeletingComment}
                                >
                                  {isDeletingComment ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Reply Input */}
          {replyingTo && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="mb-3 p-2 bg-white rounded-lg border-l-4 border-green-500">
                <p className="text-xs text-gray-500 mb-1">Replying to:</p>
                <p className="text-sm text-gray-700">
                  {getParentMessage(replyingTo)?.content}
                </p>
              </div>

              {/* File Upload for Reply */}
              {showReplyFileUpload && (
                <div className="mb-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:border-green-400 transition-colors">
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
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: 15MB. Accepted formats: JPG, PNG, GIF.
                  </p>

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
                      ? "text-green-600 bg-green-50 hover:bg-green-100"
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
                  className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                  disabled={isCreatingReply}
                />
                <Button
                  onClick={handleSendNewReply}
                  size="sm"
                  className="rounded-full bg-green-600 hover:bg-green-700 text-white p-2 flex-shrink-0"
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-400 transition-colors">
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
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: 15MB. Accepted formats: JPG, PNG, GIF.
                  </p>

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
                      ? "text-green-600 bg-green-50 hover:bg-green-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setShowFileUpload(!showFileUpload)}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Add a comment..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    !isCreatingComment &&
                    handleSendNewMessage()
                  }
                  className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                  disabled={isCreatingComment}
                />
                <Button
                  onClick={handleSendNewMessage}
                  size="sm"
                  className="rounded-full bg-green-600 hover:bg-green-700 text-white p-2 flex-shrink-0"
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
