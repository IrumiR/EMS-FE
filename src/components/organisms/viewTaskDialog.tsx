import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetTaskById } from "@/api/taskApi";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  subTasks: string[];
  eventId: string;
}

interface ViewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export function ViewTaskDialog({
  open,
  onOpenChange,
  task,
}: ViewTaskDialogProps) {
  const { data, isLoading, error } = useGetTaskById(open ? task.id : null) as {
    data: any;
    isLoading: boolean;
    error: { message?: string } | null;
  };
  const currentTask = data?.task;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Task</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading task details...</span>
          </div>
          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Task</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading task details</p>
              <p className="text-sm text-gray-600">
                {error?.message || "An unexpected error occurred"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Task</DialogTitle>
          <DialogDescription>
            <p>Viewing information for task: {currentTask?.taskName}</p>
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm space-y-3 mt-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2">
            <strong className="col-span-1">Task Name:</strong>
            <span className="col-span-2">{currentTask?.taskName}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <strong className="col-span-1">Description:</strong>
            <span className="col-span-2">{currentTask?.taskDescription}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <strong className="col-span-1">Status:</strong>
            <span className="col-span-2">{currentTask?.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <strong className="col-span-1">Priority:</strong>
            <span className="col-span-2">{currentTask?.priority}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <strong className="col-span-1">Event Name:</strong>
            <span className="col-span-2">{currentTask?.eventId.eventName}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <strong className="col-span-1">Start Date:</strong>
            <span className="col-span-2">
              {currentTask?.startDate
                ? new Date(currentTask?.startDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <strong className="col-span-1">End Date:</strong>
            <span className="col-span-2">
              {currentTask?.endDate
                ? new Date(currentTask?.endDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <strong className="col-span-1">Sub Tasks:</strong>
            <div className="col-span-2">
              {currentTask?.subTasks && currentTask.subTasks.length > 0 ? (
                <div className="space-y-1">
                  {currentTask.subTasks.map((subTask: string, index: number) => (
                    <div key={index} className="text-sm">
                      • {subTask}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}