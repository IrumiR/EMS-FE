import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Send, Paperclip, CornerDownRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isReply?: boolean;
  images?: string[]; 
  parentId?: number;
}

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName?: string;
}

export default function CommentDialog({ open, onOpenChange, taskName = "Task" }: CommentDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showReplyFileUpload, setShowReplyFileUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedReplyFiles, setSelectedReplyFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, isReply = false) => {
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

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
      const imageUrls = selectedFiles.map(file => createImageUrl(file));
      const message: Message = {
        id: messages.length + 1,
        sender: "You",
        avatar: "/api/placeholder/40/40",
        content: newMessage || "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReply: true,
        images: imageUrls.length > 0 ? imageUrls : undefined
      };
      setMessages([...messages, message]);
      setNewMessage("");
      setSelectedFiles([]);
      setShowFileUpload(false);
    }
  };

  const handleSendReply = () => {
    if ((replyMessage.trim() || selectedReplyFiles.length > 0) && replyingTo) {
      const imageUrls = selectedReplyFiles.map(file => createImageUrl(file));
      const reply: Message = {
        id: messages.length + 1,
        sender: "You",
        avatar: "/api/placeholder/40/40",
        content: replyMessage || "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReply: true,
        parentId: replyingTo,
        images: imageUrls.length > 0 ? imageUrls : undefined
      };
      setMessages([...messages, reply]);
      setReplyMessage("");
      setSelectedReplyFiles([]);
      setReplyingTo(null);
      setShowReplyFileUpload(false);
    }
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const handleForwardMessage = (id: number) => {
    setReplyingTo(id);
  };

  const getParentMessage = (parentId: number) => {
    return messages.find(msg => msg.id === parentId);
  };

  const getMessageWithReplies = () => {
    const topLevelMessages = messages.filter(msg => !msg.parentId);
    const replies = messages.filter(msg => msg.parentId);
    
    const result: (Message & { replies?: Message[] })[] = [];
    
    topLevelMessages.forEach(msg => {
      const messageReplies = replies.filter(reply => reply.parentId === msg.id);
      result.push({ ...msg, replies: messageReplies });
    });
    
    return result;
  };

  const messagesWithReplies = getMessageWithReplies();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-h-[90vh] h-[600px] p-0 flex flex-col">
        <DialogHeader className="p-4 flex-shrink-0">
          <DialogTitle>Comments - {taskName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messagesWithReplies.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No comments yet</p>
              </div>
            ) : (
              messagesWithReplies.map((message) => (
                <div key={message.id} className="space-y-2">
                  {/* Parent Message */}
                  <div className="group">
                    <div className={`flex ${message.isReply ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[80%] ${message.isReply ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                        <div className={`flex flex-col ${message.isReply ? 'items-end' : 'items-start'}`}>
                          <div className={`rounded-2xl px-4 py-2 ${
                            message.isReply 
                              ? 'bg-green-600 text-white rounded-br-md' 
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}>
                            {message.content && <p className="text-sm leading-relaxed">{message.content}</p>}
                            {message.images && message.images.length > 0 && (
                              <div className={`${message.content ? 'mt-2' : ''} space-y-2`}>
                                {message.images.map((imageUrl, imgIndex) => (
                                  <div key={imgIndex} className="rounded-lg overflow-hidden">
                                    <img 
                                      src={imageUrl} 
                                      alt={`Attachment ${imgIndex + 1}`} 
                                      className="w-full max-w-[200px] h-auto object-cover rounded-lg"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 px-2">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className={`flex ${message.isReply ? 'justify-end' : 'justify-start'} mt-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <div className="flex space-x-1 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                          onClick={() => handleForwardMessage(message.id)}
                        >
                          <CornerDownRight className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash2 className="w-3 h-3" />
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
                            <div className={`flex ${reply.isReply ? 'justify-end' : 'justify-start'}`}>
                              <div className={`flex max-w-[80%] ${reply.isReply ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                                <div className={`flex flex-col ${reply.isReply ? 'items-end' : 'items-start'}`}>
                                  <div className={`rounded-2xl px-4 py-2 ${
                                    reply.isReply 
                                      ? 'bg-green-600 text-white rounded-br-md' 
                                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                  }`}>
                                    {/* Parent message preview inside reply */}
                                    {parentMsg && (
                                      <div className={`mb-2 pb-2 border-b ${
                                        reply.isReply 
                                          ? 'border-green-400 border-opacity-50' 
                                          : 'border-gray-300'
                                      }`}>
                                        <p className={`text-xs ${
                                          reply.isReply ? 'text-green-200' : 'text-gray-500'
                                        } mb-1`}>
                                          {parentMsg.sender}
                                        </p>
                                        <p className={`text-xs ${
                                          reply.isReply ? 'text-green-100' : 'text-gray-600'
                                        } leading-relaxed`}>
                                          {parentMsg.content}
                                        </p>
                                      </div>
                                    )}
                                    {reply.content && <p className="text-sm leading-relaxed">{reply.content}</p>}
                                    {reply.images && reply.images.length > 0 && (
                                      <div className={`${reply.content ? 'mt-2' : ''} space-y-2`}>
                                        {reply.images.map((imageUrl, imgIndex) => (
                                          <div key={imgIndex} className="rounded-lg overflow-hidden">
                                            <img 
                                              src={imageUrl} 
                                              alt={`Reply attachment ${imgIndex + 1}`} 
                                              className="w-full max-w-[200px] h-auto object-cover rounded-lg"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1 px-2">
                                    {reply.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Reply action buttons */}
                            <div className={`flex ${reply.isReply ? 'justify-end' : 'justify-start'} mt-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                              <div className="flex space-x-1 px-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                                  onClick={() => handleForwardMessage(reply.id)}
                                >
                                  <CornerDownRight className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                                  onClick={() => handleDeleteMessage(reply.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
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
              {/* Parent message preview */}
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
                      ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setShowReplyFileUpload(!showReplyFileUpload)}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                  className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <Button
                  onClick={handleSendReply}
                  size="sm"
                  className="rounded-full bg-green-600 hover:bg-green-700 text-white p-2 flex-shrink-0"
                  disabled={!replyMessage.trim() && selectedReplyFiles.length === 0}
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setReplyingTo(null);
                    setShowReplyFileUpload(false);
                    setSelectedReplyFiles([]);
                  }}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-gray-500 hover:text-gray-700 p-2 flex-shrink-0"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Regular Message Input */}
          {!replyingTo && (
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              {/* File Upload Section */}
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
                      ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setShowFileUpload(!showFileUpload)}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Add a comment..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="rounded-full bg-green-600 hover:bg-green-700 text-white p-2 flex-shrink-0"
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}