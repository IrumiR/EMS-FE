import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
}

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export function EditTaskDialog({ open, onOpenChange, task }: EditTaskDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                {/* Add your form or content here */}
                <div className="space-y-4">
                    <p>Editing task: {task.taskName}</p>
                    {/* Add your form fields here */}
                </div>
                <DialogFooter>
                   
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}