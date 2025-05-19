import { useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, MessageCircle, Paperclip, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type InventoryItem = { id: number; name: string; quantity: number };
type Comment = { id: number; text: string; date: string; attachments: any[] };
type SubTask = { id: number; name: string; status: string; progress: number };
type Task = {
  id: number;
  name: string;
  assignee: string;
  status: string;
  progress: number;
  inventoryItems: InventoryItem[];
  comments: Comment[];
  subTasks: SubTask[];
};
type UpdateTaskAssigneeStepProps = {
  initialData: { tasks: Task[] };
  onSubmit: (taskData: Partial<any>) => void;
  onBack: () => void;
  onCancel: () => void;
};

function UpdateTaskAssigneeStep({ initialData, onSubmit, onBack, onCancel }: UpdateTaskAssigneeStepProps) {
  const [tasks, setTasks] = useState(initialData.tasks || [{ 
    id: 1, 
    name: "", 
    assignee: "", 
    status: "pending", 
    progress: 0,
    inventoryItems: [{ id: 1, name: "", quantity: 1 }],
    comments: [],
    subTasks: []
  }]);
  
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});

  // Toggle comments section
  const toggleComments = (taskId: number) => {
    setOpenComments(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Toggle expanded view for task
  const toggleTaskExpand = (taskId: number) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Handle adding new task
  const addTask = () => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t: any) => t.id)) + 1 : 1;
    setTasks([...tasks, { 
      id: newId, 
      name: "", 
      assignee: "", 
      status: "pending", 
      progress: 0,
      inventoryItems: [{ id: 1, name: "", quantity: 1 }],
      comments: [],
      subTasks: []
    }]);
  };

  // Define a Task type for better type safety
  type Task = {
    id: number;
    name: string;
    assignee: string;
    status: string;
    progress: number;
    inventoryItems: { id: number; name: string; quantity: number }[];
    comments: { id: number; text: string; date: string; attachments: any[] }[];
    subTasks: { id: number; name: string; status: string; progress: number }[];
  };

  // Handle removing task
  const removeTask = (id: number) => {
    setTasks(tasks.filter((task: Task) => task.id !== id));
  };

  // Handle task field change
  const handleTaskChange = (id: number, field: string, value: any) => {
    setTasks(tasks.map((task: Task) => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  // Handle adding new inventory item
  const addInventoryItem = (taskId: number) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        const newId = task.inventoryItems.length > 0 ? 
          Math.max(...task.inventoryItems.map(item => item.id)) + 1 : 1;
        return {
          ...task,
          inventoryItems: [...task.inventoryItems, { id: newId, name: "", quantity: 1 }]
        };
      }
      return task;
    }));
  };

  // Handle removing inventory item
  const removeInventoryItem = (taskId: number, itemId: number) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        return {
          ...task,
          inventoryItems: task.inventoryItems.filter(item => item.id !== itemId)
        };
      }
      return task;
    }));
  };

  // Handle inventory item field change
  const handleInventoryItemChange = (taskId: number, itemId: number, field: string, value: any) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        return {
          ...task,
          inventoryItems: task.inventoryItems.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      }
      return task;
    }));
  };

  // Handle adding a sub task
  const addSubTask = (taskId: number) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        const newId = task.subTasks.length > 0 ? 
          Math.max(...task.subTasks.map(st => st.id)) + 1 : 1;
        return {
          ...task,
          subTasks: [...task.subTasks, { 
            id: newId, 
            name: "", 
            status: "pending", 
            progress: 0 
          }]
        };
      }
      return task;
    }));
  };

  // Handle removing sub task
  const removeSubTask = (taskId: number, subTaskId: number) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        return {
          ...task,
          subTasks: task.subTasks.filter(st => st.id !== subTaskId)
        };
      }
      return task;
    }));
  };

  // Handle sub task field change
  const handleSubTaskChange = (taskId: number, subTaskId: number, field: string, value: any) => {
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        return {
          ...task,
          subTasks: task.subTasks.map((st: { id: number; name: string; status: string; progress: number }) => 
            st.id === subTaskId ? { ...st, [field]: value } : st
          )
        };
      }
      return task;
    }));
  };

  // Handle adding a comment
  const addComment = (taskId: number) => {
    if (!commentText[taskId] || commentText[taskId].trim() === "") return;
    
    setTasks(tasks.map((task: Task) => {
      if (task.id === taskId) {
        const newComment = {
          id: task.comments.length > 0 ? Math.max(...task.comments.map(c => c.id)) + 1 : 1,
          text: commentText[taskId],
          date: new Date().toISOString(),
          attachments: []
        };
        
        return {
          ...task,
          comments: [...task.comments, newComment]
        };
      }
      return task;
    }));
    
    // Clear comment text
    setCommentText(prev => ({
      ...prev,
      [taskId]: ""
    }));
  };

  // Handle comment text change
  const handleCommentTextChange = (taskId: number, text: string) => {
    setCommentText(prev => ({
      ...prev,
      [taskId]: text
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ tasks });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tasks and Assignees</h3>
          <Button 
            type="button" 
            size="sm"
            variant="outline"
            onClick={addTask}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>
        
        <Separator className="mb-4" />
        
        {tasks.map((task: Task) => (
          <div key={task.id} className="mb-6 border rounded-md bg-white shadow-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">Task #{task.id}</h4>
                  <Button 
                    type="button" 
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleTaskExpand(task.id)}
                    className="h-6 w-6 p-0"
                  >
                    {expandedTasks[task.id] ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                </div>
                <Button 
                  type="button" 
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTask(task.id)}
                  disabled={tasks.length === 1}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-xs">Task Name</Label>
                  <Input 
                    value={task.name} 
                    onChange={(e) => handleTaskChange(task.id, 'name', e.target.value)} 
                    className="w-full mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Assignee</Label>
                  <Select 
                    value={task.assignee} 
                    onValueChange={(value) => handleTaskChange(task.id, 'assignee', value)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="bob">Bob Johnson</SelectItem>
                      <SelectItem value="alice">Alice Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select 
                    value={task.status} 
                    onValueChange={(value) => handleTaskChange(task.id, 'status', value)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="onhold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Progress</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input 
                      type="number" 
                      value={task.progress} 
                      onChange={(e) => handleTaskChange(task.id, 'progress', parseInt(e.target.value) || 0)} 
                      className="w-20"
                      min="0"
                      max="100"
                    />
                    <span className="text-xs">%</span>
                    <Progress value={task.progress} className="h-2 flex-grow" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline"
                  onClick={() => toggleComments(task.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" /> Comments
                </Button>
              </div>
            </div>

            {/* Expanded content */}
            {expandedTasks[task.id] && (
              <div className="p-4 border-t bg-gray-50">
                {/* Inventory Items Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium">Inventory Items</h5>
                    <Button 
                      type="button" 
                      size="sm"
                      variant="outline"
                      onClick={() => addInventoryItem(task.id)}
                      className="h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Item
                    </Button>
                  </div>
                  
                  {task.inventoryItems.map((item) => (
                    <div key={item.id} className="mb-3 p-3 border rounded-md bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <h6 className="text-xs font-medium">Item #{item.id}</h6>
                        <Button 
                          type="button" 
                          size="sm"
                          variant="ghost"
                          onClick={() => removeInventoryItem(task.id, item.id)}
                          disabled={task.inventoryItems.length === 1}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Item Name</Label>
                          <Input 
                            value={item.name} 
                            onChange={(e) => handleInventoryItemChange(task.id, item.id, 'name', e.target.value)} 
                            className="w-full mt-1 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Quantity</Label>
                          <Input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e) => handleInventoryItemChange(task.id, item.id, 'quantity', parseInt(e.target.value) || 0)} 
                            className="w-full mt-1 text-sm"
                            required
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub Tasks Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium">Sub Tasks</h5>
                    <Button 
                      type="button" 
                      size="sm"
                      variant="outline"
                      onClick={() => addSubTask(task.id)}
                      className="h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Sub Task
                    </Button>
                  </div>
                  
                  {task.subTasks.map((subTask) => (
                    <div key={subTask.id} className="mb-3 p-3 border rounded-md bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <h6 className="text-xs font-medium">Sub Task #{subTask.id}</h6>
                        <Button 
                          type="button" 
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSubTask(task.id, subTask.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Name</Label>
                          <Input 
                            value={subTask.name} 
                            onChange={(e) => handleSubTaskChange(task.id, subTask.id, 'name', e.target.value)} 
                            className="w-full mt-1 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Status</Label>
                          <Select 
                            value={subTask.status} 
                            onValueChange={(value) => handleSubTaskChange(task.id, subTask.id, 'status', value)}
                          >
                            <SelectTrigger className="w-full mt-1 text-sm">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inprogress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label className="text-xs">Progress</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input 
                            type="number" 
                            value={subTask.progress} 
                            onChange={(e) => handleSubTaskChange(task.id, subTask.id, 'progress', parseInt(e.target.value) || 0)} 
                            className="w-16 text-sm"
                            min="0"
                            max="100"
                          />
                          <span className="text-xs">%</span>
                          <Progress value={subTask.progress} className="h-2 flex-grow" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            {openComments[task.id] && (
              <div className="p-4 border-t bg-gray-50">
                <h5 className="text-sm font-medium mb-3">Comments</h5>
                
                {/* Display existing comments */}
                <div className="space-y-2 mb-3">
                  {task.comments.map(comment => (
                    <div key={comment.id} className="bg-white p-2 rounded-md border text-sm">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>User</span>
                        <span>{new Date(comment.date).toLocaleString()}</span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
                
                {/* Add new comment */}
                <div className="flex items-end space-x-2">
                  <div className="flex-grow relative">
                    <Input 
                      value={commentText[task.id] || ''} 
                      onChange={(e) => handleCommentTextChange(task.id, e.target.value)}
                      placeholder="Write a comment..."
                      className="pr-10"
                    />
                    <Button 
                      type="button" 
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <Paperclip className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={() => addComment(task.id)}
                    disabled={!commentText[task.id] || commentText[task.id].trim() === ""}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="default"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Update
        </Button>
      </div>
    </form>
  );
}

export default UpdateTaskAssigneeStep;