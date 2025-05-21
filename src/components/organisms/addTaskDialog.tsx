import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Plus, Trash2 } from "lucide-react"; // Added Trash2 icon import
import { useState } from "react";
import DatePickerComponent from "../atoms/datePicker";
import { MultiSelect } from "primereact/multiselect";
import { ScrollArea } from "../ui/scroll-area";

export function AddTaskDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [assignees, setAssignees] = useState(null);
  const [inventoryItems, setInventoryItems] = useState(null);
  const [priority, setPriority] = useState("");
  const [subTasks, setSubTasks] = useState([{ name: "" }]);

  const priorityOptions = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { name: "" }]);
  };

  const handleSubTaskChange = (index: number, value: string) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[index] = { name: value };
    setSubTasks(updatedSubTasks);
  };

  // Added function to delete subtask
  const handleDeleteSubTask = (index: number) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks.splice(index, 1);
    setSubTasks(updatedSubTasks.length ? updatedSubTasks : [{ name: "" }]);
  };

  const handleCreateTask = () => {
    // Handle task creation logic here
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="flex gap-1 bg-green-600 py-2 pl-2 sm:pr-2 pr-2 items-center rounded-md text-white max-h-[38px] text-xsxl">
        <div className="flex items-center gap-1">
          <Plus strokeWidth={1.4} />
          <span className="hidden xl:inline">Create Task</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] max-h-[100vh]"> {/* Increased max-width for more space */}
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Added more height to ScrollArea to ensure all content is visible */}
          <ScrollArea className="h-[65vh] pr-4">
            {/* Increased spacing between form fields */}
            <div className="grid gap-6"> {/* Changed gap-2 to gap-6 for more vertical spacing */}
              <div className="grid gap-3"> {/* Changed gap-2 to gap-3 for more spacing between label and input */}
                <Label htmlFor="taskName">Main Task</Label>
                <Input
                  id="taskName"
                  placeholder="Add Task Name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>

              <div className="grid gap-3"> {/* Changed gap-2 to gap-3 */}
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3"> {/* Changed gap-2 to gap-3 */}
                  <Label htmlFor="startDate">Start Date</Label>
                  <DatePickerComponent
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date ?? undefined)}
                    dateFormat="MMMM d, yyyy"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholderText="Pick a date"
                  />
                </div>

                <div className="grid gap-3"> {/* Changed gap-2 to gap-3 */}
                  <Label htmlFor="endDate">End Date</Label>
                  <DatePickerComponent
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date ?? undefined)}
                    dateFormat="MMMM d, yyyy"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholderText="Pick a date"
                  />
                </div>
              </div>

              <div className="grid gap-3"> {/* Changed gap-2 to gap-3 */}
                <Label htmlFor="assignees">Assignee</Label>
                <MultiSelect
                  id="assignees"
                  value={assignees}
                  onChange={(e) => setAssignees(e.value)}
                  placeholder="Select Assignees"
                  className="w-full"
                />
              </div>

              <div className="grid gap-3"> {/* Changed gap-2 to gap-3 */}
                <Label htmlFor="inventoryItems">Inventory Items</Label>
                <MultiSelect
                  id="inventoryItems"
                  value={inventoryItems}
                  onChange={(e) => setInventoryItems(e.value)}
                  placeholder="Select Inventory Items"
                  className="w-full"
                />
              </div>

              <div className="grid gap-3"> {/* Changed gap-2 to gap-3 */}
                <Label htmlFor="priority">Priority</Label>
                {/* Increased width for priority dropdown */}
                <div className="w-full"> {/* Added wrapper with full width */}
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3"> {/* Changed gap-2 to gap-3 */}
                <Label>Subtasks</Label>
                {subTasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2"> {/* Added flex container for input + delete icon */}
                    <Input
                      placeholder="Add Subtask"
                      value={subtask.name}
                      onChange={(e) => handleSubTaskChange(index, e.target.value)}
                      className="mb-2 flex-1" /* Added flex-1 to make input take available space */
                    />
                    {/* Added delete button with trash icon */}
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
                
                {/* Ensured "Add Subtask" button is fully visible with more bottom margin */}
                <div className="mb-6"> {/* Added extra margin at bottom */}
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

        <DialogFooter className="flex justify-between sm:justify-between mt-4"> {/* Added more top margin */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleCreateTask}
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}