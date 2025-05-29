import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit3, Trash2, Send, Paperclip } from 'lucide-react';
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
  image?: string;
}

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName?: string;
}

export function CommentDialog({ open, onOpenChange, taskName = "Task" }: CommentDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Edwin Johnson",
      avatar: "/api/placeholder/40/40",
      content: "Hi! I'm interested in the apartment listing I saw online. Is it still available for next weekend?",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      sender: "You",
      avatar: "/api/placeholder/40/40",
      content: "Yes it is! Do you want me to set you viewing with others?",
      timestamp: "10:35 AM",
      isReply: true
    }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "You",
        avatar: "/api/placeholder/40/40",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReply: true
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const handleEditMessage = (id: number) => {
    console.log("Edit message", id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[600px] p-0">
        <DialogHeader className="p-4">
          <DialogTitle>Comments - {taskName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No comments yet</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="group">
                  <div className={`flex ${message.isReply ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[80%] ${message.isReply ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                      
                      
                      <div className={`flex flex-col ${message.isReply ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-2 ${
                          message.isReply 
                            ? 'bg-green-600 text-white rounded-br-md' 
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          {message.image && (
                            <div className="mt-2 rounded-lg overflow-hidden">
                              <img 
                                src={message.image} 
                                alt="Attachment" 
                                className="w-full h-32 object-cover"
                              />
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
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                        onClick={() => handleEditMessage(message.id)}
                      >
                        <Edit3 className="w-3 h-3" />
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
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
                className="rounded-full bg-green-600 hover:bg-green-700 text-white p-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
