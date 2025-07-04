import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { HiOutlineClipboardList } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useGetTaskById } from "@/api/taskApi";

interface SubTask {
  name: string;
  status: string;
  _id?: string;
}

interface ViewSubTaskDialogProps {
  taskId: string;
  taskName?: string;
}

const statusOptions = [
  { value: "To Do", label: "To Do", color: "text-blue-600 bg-blue-50" },
  {
    value: "In Progress",
    label: "In Progress",
    color: "text-green-600 bg-green-50",
  },
  {
    value: "Completed",
    label: "Completed",
    color: "text-purple-600 bg-purple-50",
  },
  { value: "Cancelled", label: "Cancelled", color: "text-gray-600 bg-gray-50" },
];

const extractSubTaskName = (subtask: any) => {
  if (subtask.subTaskName && typeof subtask.subTaskName === "string") {
    return subtask.subTaskName;
  }

  const keys = Object.keys(subtask)
    .filter((key) => !isNaN(Number(key)) && key !== "status" && key !== "_id")
    .sort((a, b) => parseInt(a) - parseInt(b));

  if (keys.length > 0) {
    return keys.map((key) => subtask[key]).join("");
  }

  if (subtask.name && typeof subtask.name === "string") {
    return subtask.name;
  }

  const allKeys = Object.keys(subtask).filter(
    (key) => key !== "status" && key !== "_id"
  );
  if (allKeys.length > 0) {
    return subtask[allKeys[0]] || "";
  }

  return "";
};

export function ViewSubTaskDialog({
  taskId,
  taskName,
}: ViewSubTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);

  const {
    data: taskData,
    isLoading: taskLoading,
    refetch: refetchTask,
  } = useGetTaskById(taskId, isOpen);

  useEffect(() => {
    if (taskData && isOpen) {
      const taskDetails = taskData.task || taskData;

      if (
        taskDetails.subTasks &&
        Array.isArray(taskDetails.subTasks) &&
        taskDetails.subTasks.length > 0
      ) {
        const normalizedSubTasks = taskDetails.subTasks.map((subtask: any) => {
          const extractedName = extractSubTaskName(subtask);
          return {
            name: extractedName,
            status: subtask.status || "To Do",
            _id: subtask._id || undefined,
          };
        });

        const validSubTasks = normalizedSubTasks.filter(
          (subtask: any) =>
            subtask.name &&
            subtask.name.trim() !== "" &&
            subtask.name !== "undefined"
        );

        setSubTasks(validSubTasks);
      } else {
        setSubTasks([]);
      }
    }
  }, [taskData, isOpen]);


  useEffect(() => {
    if (isOpen && taskId) {
      refetchTask();
    }
  }, [isOpen, taskId, refetchTask]);

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((option) => option.value === status)?.color ||
      "text-gray-600 bg-gray-50"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 mt-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          title="View Sub Tasks"
        >
          Sub Tasks
          <HiOutlineClipboardList className="h-4 w-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Sub Tasks</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            <p>Viewing subtasks for task: {taskName || "Current Task"}</p>
          </DialogDescription>
        </DialogHeader>

        {taskLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-sm text-gray-500">Loading subtasks...</div>
          </div>
        ) : (
          <div className="py-4">
            {subTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">
                  No subtasks found for this task.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {subTasks.map((subtask, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {subtask.name}
                      </h4>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          subtask.status
                        )}`}
                      >
                        {subtask.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
