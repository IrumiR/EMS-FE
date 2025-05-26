import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import DatePickerComponent from "../atoms/datePicker";
import { MultiSelect } from "primereact/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetAllEventsDropdown } from "@/api/taskApi";
import { useGetAssigneeOptions } from "@/api/authApi";
import { Assignee } from "../types/addEventTypes";
import { useGetTaskById, useUpdateTask } from "@/api/taskApi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  eventId?: string;
  assignees?: any[];
  subTasks?: { subTaskName: string }[];
}

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

const validationSchema = Yup.object({
  taskName: Yup.string()
    .required("Task name is required")
    .min(3, "Task name must be at least 3 characters"),
  taskDescription: Yup.string()
    .required("Description is required"),
  startDate: Yup.date()
    .required("Start date is required")
    .nullable(),
  endDate: Yup.date()
    .required("End date is required")
    .nullable()
    .min(Yup.ref('startDate'), "End date must be after start date"),
  priority: Yup.string()
    .required("Priority is required")
    .oneOf(['high', 'medium', 'low'], "Invalid priority"),
  eventId: Yup.string().when('isEventRequired', {
    is: true,
    then: (schema) => schema.required('Event is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  assignees: Yup.array()
    .min(1, "At least one assignee is required")
    .required("Assignees are required"),
});

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
}: EditTaskDialogProps) {
  const { eventId } = useParams();
  const eventList = useGetAllEventsDropdown();
  

  const { data: taskData, isLoading: taskLoading, refetch: refetchTask } = useGetTaskById(task.id);
  const { data: assigneesData, isLoading: assigneesLoading } = useGetAssigneeOptions();
  const updateTaskMutation = useUpdateTask(
    (data: any) => {
      toast.success("Task is updated successfully", {
        duration: 4000,
        position: 'top-center',
      });
      onOpenChange(false);
      formik.resetForm();
      setSubTasks([{ name: "" }]);
    },
    (error: any) => {
      toast.error("Failed to update task", {
        duration: 4000,
        position: 'top-right',
      });
      console.error("Failed to update task:", error);
    }
  );

  const [subTasks, setSubTasks] = useState([{ name: "" }]);

  const assignees = assigneesData?.assignees?.map((a) => ({
    name: a.userName,
    id: a.userId,
  })) || [];

  const assigneeItemTemplate = (option: Assignee) => {
    return (
      <div className="flex items-center py-1 px-2">
        <span>{option.name}</span>
      </div>
    );
  };

  const formik = useFormik({
    initialValues: {
      taskName: "",
      taskDescription: "",
      startDate: null as Date | null,
      endDate: null as Date | null,
      priority: "",
      eventId: eventId || "",
      assignees: [] as any[],
      isEventRequired: !eventId, 
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const priorityMap: Record<string, "High" | "Medium" | "Low"> = {
          high: "High",
          medium: "Medium",
          low: "Low",
        };

        const updateData = {
          taskName: values.taskName,
          taskDescription: values.taskDescription,
          startDate: values.startDate?.toISOString(),
          endDate: values.endDate?.toISOString(),
          priority: priorityMap[values.priority] ?? undefined,
          eventId: values.eventId || eventId,
          assignees: values.assignees.map((assignee) => assignee.id),
          subTasks: subTasks
            .filter((subtask) => subtask.name.trim() !== "")
            .map((subtask) => ({
              subTaskName: subtask.name.trim(),
            })),
        };

        await updateTaskMutation.mutateAsync({
          taskId: task.id,
          taskData: updateData,
        });

        onOpenChange(false);
        
        formik.resetForm();
        setSubTasks([{ name: "" }]);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    },
  });

  // Helper function to normalize priority values
  const normalizePriority = (priority: string): string => {
    if (!priority) return "";
    const priorityLower = priority.toLowerCase();
    if (['high', 'medium', 'low'].includes(priorityLower)) {
      return priorityLower;
    }
    return "";
  };

  useEffect(() => {
    if (taskData && open) {
      const taskDetails = taskData.task || taskData;
 
      let extractedEventId = "";
      if (taskDetails.eventId) {
        if (typeof taskDetails.eventId === 'object' && taskDetails.eventId._id) {
          // If eventId is an object with _id property
          extractedEventId = taskDetails.eventId._id;
        } else if (typeof taskDetails.eventId === 'string') {
          // If eventId is already a string
          extractedEventId = taskDetails.eventId;
        }
      }
      
      formik.setValues({
        taskName: taskDetails.taskName || "",
        taskDescription: taskDetails.taskDescription || "",
        startDate: taskDetails.startDate ? new Date(taskDetails.startDate) : null,
        endDate: taskDetails.endDate ? new Date(taskDetails.endDate) : null,
        priority: normalizePriority(taskDetails.priority || ""),
        eventId: extractedEventId || eventId || "",
        assignees: taskDetails.assignees ? taskDetails.assignees.map((assignee: any) => ({
          name: assignee.userName || assignee.name,
          id: assignee._id || assignee.userId || assignee.id,
        })) : [],
        isEventRequired: !eventId,
      });

      // Set subtasks properly
      if (taskDetails.subTasks && Array.isArray(taskDetails.subTasks) && taskDetails.subTasks.length > 0) {
        const normalizedSubTasks = taskDetails.subTasks.map((subtask: any) => ({
          name: subtask.subTaskName || "",
          status: subtask.status || "To Do", 
        }));

        setSubTasks(normalizedSubTasks);
      } else {
        setSubTasks([{ name: "" }]);
      }
    }
  }, [taskData, open, eventId]);

  useEffect(() => {
    if (open && task.id) {
      refetchTask();
    }
  }, [open, task.id, refetchTask]);

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { name: "" }]);
  };

  const handleSubTaskChange = (index: number, value: string) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[index] = { name: value };
    setSubTasks(updatedSubTasks);
  };

  const handleDeleteSubTask = (index: number) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks.splice(index, 1);
    setSubTasks(updatedSubTasks.length ? updatedSubTasks : [{ name: "" }]);
  };

  const handleCancel = () => {
    formik.resetForm();
    setSubTasks([{ name: "" }]);
    onOpenChange(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            <p>Editing information for task: {task.taskName}</p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-2">
            <ScrollArea className="h-[65vh] pr-4">
              <div className="grid gap-6">
                {!eventId && (
                  <div className="grid gap-3">
                    <Label htmlFor="eventId">Event</Label>
                    <div className="w-full">
                      <Select
                        value={formik.values.eventId}
                        onValueChange={(value) => formik.setFieldValue('eventId', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Event" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventList.data?.events?.length ? (
                            eventList.data.events.map((event) => (
                              <SelectItem key={event._id} value={event._id}>
                                {event.eventName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-events" disabled>
                              No events available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {formik.touched.eventId && formik.errors.eventId && (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.eventId}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="taskName">Main Task</Label>
                  <Input
                    id="taskName"
                    name="taskName"
                    placeholder="Add Task Name"
                    value={formik.values.taskName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.taskName && formik.errors.taskName && (
                    <p className="text-sm text-red-500">{formik.errors.taskName}</p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    name="taskDescription"
                    placeholder="Add Description"
                    value={formik.values.taskDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="min-h-[80px]"
                  />
                  {formik.touched.taskDescription && formik.errors.taskDescription && (
                    <p className="text-sm text-red-500">{formik.errors.taskDescription}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="startDate">Start Date</Label>
                    <DatePickerComponent
                      selected={formik.values.startDate ?? undefined}
                      onChange={(date: Date | null) => formik.setFieldValue('startDate', date)}
                      dateFormat="MMMM d, yyyy"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholderText="Pick a date"
                    />
                    {formik.touched.startDate && formik.errors.startDate && (
                      <p className="text-sm text-red-500">{formik.errors.startDate}</p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="endDate">End Date</Label>
                    <DatePickerComponent
                      selected={formik.values.endDate ?? undefined}
                      onChange={(date: Date | null) => formik.setFieldValue('endDate', date)}
                      dateFormat="MMMM d, yyyy"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholderText="Pick a date"
                    />
                    {formik.touched.endDate && formik.errors.endDate && (
                      <p className="text-sm text-red-500">{formik.errors.endDate}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="assignees">Assignee</Label>
                  <MultiSelect
                    value={formik.values.assignees}
                    onChange={(e: any) => {
                      formik.setFieldValue('assignees', e.value);
                    }}
                    options={assignees}
                    optionLabel="name"
                    filterBy="name"
                    dataKey="id"
                    placeholder={
                      assigneesLoading
                        ? "Loading assignees..."
                        : "Select assignees"
                    }
                    maxSelectedLabels={3}
                    className="prime-multiselect w-full h-11"
                    itemTemplate={assigneeItemTemplate}
                    style={{ width: "100%" }}
                    appendTo="self"
                    filter={true}
                    showClear={true}
                    panelClassName="prime-panel"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="priority">Priority</Label>
                  <div className="w-full">
                    <Select 
                      value={formik.values.priority} 
                      onValueChange={(value) => formik.setFieldValue('priority', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.priority && formik.errors.priority && (
                      <p className="text-sm text-red-500">{formik.errors.priority}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Subtasks</Label>
                  {subTasks.map((subtask, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Add Subtask"
                        value={subtask.name}
                        onChange={(e) =>
                          handleSubTaskChange(index, e.target.value)
                        }
                        className="mb-2 flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSubTask(index)}
                        className="mb-2"
                        disabled={subTasks.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}

                  <div className="mb-6">
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
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={updateTaskMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={updateTaskMutation.isLoading || taskLoading}
            >
              {updateTaskMutation.isLoading ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}