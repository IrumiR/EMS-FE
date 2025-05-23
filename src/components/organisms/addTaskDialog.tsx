import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DatePickerComponent from "../atoms/datePicker";
import { MultiSelect } from "primereact/multiselect";
import { ScrollArea } from "../ui/scroll-area";
import {
  CreateTaskData,
  useCreateTask,
  useGetAllEventsDropdown,
} from "@/api/taskApi";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useGetAssigneeOptions } from "@/api/authApi";
import { Assignee } from "../types/addEventTypes";
import { useParams } from "react-router-dom";

export function AddTaskDialog() {
  const { eventId } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);
  const eventList = useGetAllEventsDropdown();
  console.log(eventList, "eventList");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const { mutateAsync: createTask, isLoading } = useCreateTask(
    (message: string) => {
      toast.success(message);
    },
    (message: string) => {
      toast.error(message);
    }
  );

  const initialValues = {
    taskName: "",
    description: "",
    startDate: undefined,
    endDate: undefined,
    assignees: [],
    inventoryItems: [],
    priority: "",
    subTasks: [{ name: "" }],
  };

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Task name is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
    assignees: Yup.array().min(1, "At least one assignee is required"),
    priority: Yup.string().required("Priority is required"),
  });

  const userId = localStorage.getItem("userId");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const taskData: CreateTaskData = {
          eventId: selectedEventId || eventId || "",
          taskName: values.taskName,
          taskDescription: values.description || "",
          startDate: values.startDate
            ? new Date(values.startDate).toISOString()
            : "",
          endDate: values.endDate ? new Date(values.endDate).toISOString() : "",
          assignees: selectedAssignees.map((a) => a.id),
          inventoryItems: values.inventoryItems || [],
          priority: values.priority
            ? ((values.priority.charAt(0).toUpperCase() +
                values.priority.slice(1).toLowerCase()) as
                | "Low"
                | "Medium"
                | "High")
            : undefined,
          subTasks: values.subTasks
            .filter((task) => task.name.trim() !== "")
            .map((task) => task.name),
          createdBy: userId ?? "",
        };

        await createTask(taskData);
        formik.resetForm();
        setSelectedAssignees([]);
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    },
  });

  const handleAddSubTask = () => {
    formik.setFieldValue("subTasks", [...formik.values.subTasks, { name: "" }]);
  };

  const handleSubTaskChange = (index: number, value: string) => {
    const updatedSubTasks = [...formik.values.subTasks];
    updatedSubTasks[index] = { name: value };
    formik.setFieldValue("subTasks", updatedSubTasks);
  };

  const handleDeleteSubTask = (index: number) => {
    const updatedSubTasks = [...formik.values.subTasks];
    updatedSubTasks.splice(index, 1);
    formik.setFieldValue(
      "subTasks",
      updatedSubTasks.length ? updatedSubTasks : [{ name: "" }]
    );
  };

  const { data: assigneesData, isLoading: assigneesLoading } =
    useGetAssigneeOptions();

  const assignees =
    assigneesData?.assignees?.map((a) => ({
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

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      formik.resetForm();
      setSelectedAssignees([]);
    }
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger className="flex gap-1 bg-green-600 py-2 pl-2 sm:pr-2 pr-2 items-center rounded-md text-white max-h-[38px] text-xsxl">
        <div className="flex items-center gap-1">
          <Plus strokeWidth={1.4} />
          <span className="hidden xl:inline">Create Task</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-2">
            <ScrollArea className="h-[65vh] pr-4">
              <div className="grid gap-6">
                {!eventId && (
                  <div className="grid gap-3">
                    <Label htmlFor="event">Event</Label>
                    <div className="w-full">
                      <Select
                        value={selectedEventId}
                        onValueChange={(value) => setSelectedEventId(value)}
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
                    className={
                      formik.touched.taskName && formik.errors.taskName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.taskName && formik.errors.taskName && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.taskName}
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Add Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="startDate">Start Date</Label>
                    <DatePickerComponent
                      selected={formik.values.startDate}
                      onChange={(date) =>
                        formik.setFieldValue("startDate", date)
                      }
                      dateFormat="MMMM d, yyyy"
                      className={`w-full border rounded-md px-3 py-2 text-sm ${
                        formik.touched.startDate && formik.errors.startDate
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholderText="Pick a date"
                    />
                    {formik.touched.startDate && formik.errors.startDate && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.startDate}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="endDate">End Date</Label>
                    <DatePickerComponent
                      selected={formik.values.endDate}
                      onChange={(date) => formik.setFieldValue("endDate", date)}
                      dateFormat="MMMM d, yyyy"
                      className={`w-full border rounded-md px-3 py-2 text-sm ${
                        formik.touched.endDate && formik.errors.endDate
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholderText="Pick a date"
                    />
                    {formik.touched.endDate && formik.errors.endDate && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.endDate}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="assignees">Assignee</Label>
                  <MultiSelect
                    value={selectedAssignees}
                    onChange={(e: any) => {
                      const selected = e.value;
                      setSelectedAssignees(selected);
                      const assigneeIds = selected.map(
                        (assignee: any) => assignee.id
                      );
                      formik.setFieldValue("assignees", assigneeIds);
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

                  {formik.touched.assignees && formik.errors.assignees && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.assignees}
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="priority">Priority</Label>
                  <div className="w-full">
                    <Select
                      value={formik.values.priority}
                      onValueChange={(value) =>
                        formik.setFieldValue("priority", value)
                      }
                    >
                      <SelectTrigger
                        className={`w-full ${
                          formik.touched.priority && formik.errors.priority
                            ? "border-red-500"
                            : ""
                        }`}
                        onBlur={() => formik.setFieldTouched("priority", true)}
                      >
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.priority && formik.errors.priority && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.priority}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Subtasks</Label>
                  {formik.values.subTasks.map((subtask, index) => (
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
              onClick={() => handleDialogOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}