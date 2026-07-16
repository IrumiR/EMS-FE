import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { HiOutlineClipboardList } from "react-icons/hi";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { useGetTaskById, useUpdateTask } from "@/api/taskApi";
import { toast } from "react-hot-toast";

interface SubTask {
  name: string;
  status: string;
  _id?: string;
}

interface SubTaskDialogProps {
  taskId: string;
  taskName?: string;
}

const statusOptions = [
  { value: "To Do", label: "To Do", color: "text-blue-600" },
  { value: "In Progress", label: "In Progress", color: "text-green-600" },
  { value: "Completed", label: "Completed", color: "text-purple-600" },
  { value: "Cancelled", label: "Cancelled", color: "text-gray-600" },
];


const extractSubTaskName = (subtask: any) => {
  if (subtask.subTaskName && typeof subtask.subTaskName === 'string') {
    return subtask.subTaskName;
  }
  
  const keys = Object.keys(subtask)
    .filter(key => !isNaN(Number(key)) && key !== 'status' && key !== '_id')
    .sort((a, b) => parseInt(a) - parseInt(b));
  
  if (keys.length > 0) {
    return keys.map(key => subtask[key]).join('');
  }

  if (subtask.name && typeof subtask.name === 'string') {
    return subtask.name;
  }
  return "";
};

export function SubTaskDialog({ taskId, taskName }: SubTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subTasks, setSubTasks] = useState<SubTask[]>([
    { name: "", status: "To Do" },
  ]);

  const { data: taskData, isLoading: taskLoading, refetch: refetchTask } = useGetTaskById(taskId, isOpen);
  
  const updateTaskMutation = useUpdateTask(
    () => {
      toast.success("Subtasks updated successfully", {
        duration: 4000,
        position: 'top-center',
      });
      setIsOpen(false);
      refetchTask();
    },
    (error: any) => {
      const message =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || "Failed to update subtasks";
      toast.error(message, {
        duration: 4000,
        position: 'top-right',
      });
      console.error("Failed to update subtasks:", error);
    }
  );

  useEffect(() => {
    if (taskData && isOpen) {
      const taskDetails = taskData.task || taskData;
      
      if (taskDetails.subTasks && Array.isArray(taskDetails.subTasks) && taskDetails.subTasks.length > 0) {
        const normalizedSubTasks = taskDetails.subTasks.map((subtask: any) => {
          const extractedName = extractSubTaskName(subtask);
          return {
            name: extractedName,
            status: subtask.status || "To Do",
            _id: subtask._id || undefined,
          };
        });

        const validSubTasks = normalizedSubTasks.filter((subtask: any) => 
          subtask.name && subtask.name.trim() !== ""
        );
        
        setSubTasks(validSubTasks.length > 0 ? validSubTasks : [{ name: "", status: "To Do" }]);
      } else {
        setSubTasks([{ name: "", status: "To Do" }]);
      }
    }
  }, [taskData, isOpen]);

  useEffect(() => {
    if (isOpen && taskId) {
      refetchTask();
    }
  }, [isOpen, taskId, refetchTask]);

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { name: "", status: "To Do" }]);
  };

  const handleSubTaskChange = (
    index: number,
    field: keyof SubTask,
    value: string
  ) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[index] = { ...updatedSubTasks[index], [field]: value };
    setSubTasks(updatedSubTasks);
  };

  const handleDeleteSubTask = (index: number) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks.splice(index, 1);
    setSubTasks(
      updatedSubTasks.length ? updatedSubTasks : [{ name: "", status: "To Do" }]
    );
  };

  const handleUpdateSubTasks = async () => {
    try {
      const validSubTasks = subTasks.filter(subtask => subtask.name.trim() !== "");
 
      const updateData = {
        subTasks: validSubTasks.map((subtask) => ({
          subTaskName: subtask.name.trim(),
          status: subtask.status,
        })),
      };

      await updateTaskMutation.mutateAsync({
        taskId: taskId,
        taskData: updateData,
      });

    } catch (error) {
      console.error("Failed to update subtasks:", error);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (taskData) {
      const taskDetails = taskData.task || taskData;
      if (taskDetails.subTasks && Array.isArray(taskDetails.subTasks)) {
        const normalizedSubTasks = taskDetails.subTasks.map((subtask: any) => ({
          name: extractSubTaskName(subtask),
          status: subtask.status || "To Do",
          _id: subtask._id || undefined,
        }));
        setSubTasks(normalizedSubTasks.length > 0 ? normalizedSubTasks : [{ name: "", status: "To Do" }]);
      }
    }
  };

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((option) => option.value === status)?.color ||
      "text-gray-600"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 mt-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          title="Sub Tasks"
        >
          Sub Tasks
          <HiOutlineClipboardList className="h-4 w-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Sub Tasks</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            <p>Editing subtasks for task: {taskName || "Current Task"}</p>
          </DialogDescription>
        </DialogHeader>

        {taskLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-sm text-gray-500">Loading subtasks...</div>
          </div>
        ) : (
          <div className="grid gap-3 py-4">
            {subTasks.map((subtask, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-2 items-start sm:items-center"
              >
                <Input
                  placeholder="Add Subtask"
                  value={subtask.name}
                  onChange={(e) =>
                    handleSubTaskChange(index, "name", e.target.value)
                  }
                  className="w-full"
                />
                <Select
                  value={subtask.status}
                  onValueChange={(value) =>
                    handleSubTaskChange(index, "status", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <span className={getStatusColor(subtask.status)}>
                        {
                          statusOptions.find(
                            (option) => option.value === subtask.status
                          )?.label
                        }
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={option.color}>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSubTask(index)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 justify-self-end sm:justify-self-auto"
                  disabled={subTasks.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSubTask}
                className="w-full"
              >
                Add Subtask
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateTaskMutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateSubTasks}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={updateTaskMutation.isLoading || taskLoading}
          >
            {updateTaskMutation.isLoading ? "Updating..." : "Update Subtasks"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}