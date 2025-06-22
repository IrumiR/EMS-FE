import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  Pencil,
  MessageCircle,
  ArrowUp,
  MoveDown,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { EditTaskDialog } from "../organisms/editTaskDialog";
import { ViewTaskDialog } from "../organisms/viewTaskDialog";
import { SubTaskDialog } from "../organisms/subTaskDialog";
import CommentDialog from "../organisms/commentDialog";
import TaskStatusSelect from "./updateTaskStatus";
import TaskPrioritySelect from "./updatePriority";
import { DeleteTaskDialog } from "./deleteTaskDialog";

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  subTasks: { name: string }[];
  eventId: string;
  assignees: {
    assigneeId: string;
  }[];
}

export default function TaskCard({ task }: { task: Task }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const userType = localStorage.getItem("role");

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-500 bg-red-50";
      case "medium":
        return "text-orange-500 bg-orange-50";
      case "low":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <ArrowUp className="w-3 h-3" />;
      case "medium":
        return <ArrowUp className="w-3 h-3" />;
      case "low":
        return <MoveDown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "to do":
        return "bg-blue-100 text-blue-800";
      case "in progress":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "delayed":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "NA") return "NA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Check if task is overdue
  const isTaskOverdue = () => {
    if (!task.endDate || task.endDate === "NA") return false;
    const endDate = new Date(task.endDate);
    const currentDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return endDate < currentDate;
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200 rounded-lg">
      <CardContent className="p-4 pt-2">
        {/* Priority and Status Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${getPriorityColor(
                task.priority
              )}`}
            >
              {getPriorityIcon(task.priority)}
            </div>
            <span
              className={`text-sm font-medium ${
                getPriorityColor(task.priority).split(" ")[0]
              }`}
            >
              {task.priority}
            </span>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>

        {/* Task Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
          {task.taskName}
        </h3>

        {/* Task Description */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {task.taskDescription}
        </p>

        {/* Sub Task Dialog & Due Date */}

        <div className="flex items-center justify-between mb-3">
          <SubTaskDialog taskId={task.id} taskName={task.taskName} />
          <div className="flex items-center gap-2">
            <div className="">
              <span className="text-xs text-gray-500">Due Date: </span>
              <span className="text-xs font-medium text-gray-700">
                {formatDate(task.endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Overdue Message */}
        {isTaskOverdue() && task.status === "In Progress" && (
          <div className="mb-3">
            <span className="px-2 py-1 rounded-full text-sm text-red-500 bg-red-50 font-medium">
              This task is overdue
            </span>
          </div>
        )}
      </CardContent>

      <EditTaskDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        task={{
          ...task,
          subTasks:
            task.subTasks?.map((st) => ({
              subTaskName: st.name || "",
            })) ?? [],
        }}
      />

      <ViewTaskDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        task={{
          ...task,
          subTasks:
            task.subTasks?.map((st: any) => ({
              subTaskName: st.name || "",
              status: st.status || "",
              _id: st._id || "",
            })) ?? [],
        }}
      />

      <CommentDialog
        open={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        taskId={task.id}
        taskName={task.taskName}
      />

      <DeleteTaskDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        taskId={task.id}
      />

      <CardFooter className="px-2 py-0 border-t border-gray-100">
        <TooltipProvider>
          <div className="flex items-center gap-3 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setIsCommentDialogOpen(true)}
                >
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comments</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setIsViewDialogOpen(true)}
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Task</p>
              </TooltipContent>
            </Tooltip>

            {userType !== "client" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Task</p>
                </TooltipContent>
              </Tooltip>
            )}

            {userType !== "client" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Task</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <TaskStatusSelect taskId={task.id} status={task.status} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Update Status</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <TaskPrioritySelect
                        taskId={task.id}
                        priority={task.priority}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Update Priority</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
