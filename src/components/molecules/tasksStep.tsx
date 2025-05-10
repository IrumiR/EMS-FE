import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputField from "../atoms/inputField";
import { Plus, Trash2} from "lucide-react";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useGetAssigneeOptions,  } from "@/api/authApi";
import { Assignee, InventoryItem, Task, StepProps } from "../types/addEventTypes";
import { useGetInventoryOptions } from "@/api/inventoryApi";

interface TasksAssigneesStepProps extends StepProps {
  taskInput: string;
  setTaskInput: (input: string) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  selectedAssignees: Assignee[];
  setSelectedAssignees: (assignees: Assignee[]) => void;
  selectedItems: InventoryItem[];
  setSelectedItems: (items: InventoryItem[]) => void;
}

export function TasksAssigneesStep({
  taskInput,
  setTaskInput,
  tasks,
  setTasks,
  selectedAssignees,
  setSelectedAssignees,
  selectedItems,
  setSelectedItems,
}: TasksAssigneesStepProps) {
  const { data: assigneesData, isLoading: assigneesLoading } = useGetAssigneeOptions();
  const { data: inventoryData, isLoading: inventoryLoading } = useGetInventoryOptions();
  
  const assignees = assigneesData?.assignees?.map((a) => ({
    name: a.userName,
    id: a.userId,
  })) || [];
  
  const inventoryItems = inventoryData?.items?.map(item => ({
    name: item.itemName,
    id: item.itemId,
  })) || [];

  const addTask = () => {
    if (taskInput.trim()) {
      const newTask = {
        id: Date.now().toString(),
        name: taskInput.trim(),
      };
      setTasks([...tasks, newTask]);
      setTaskInput("");
    }
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  };

  const assigneeItemTemplate = (option: Assignee) => {
    return (
      <div className="flex items-center py-1 px-2">
        <span>{option.name}</span>
      </div>
    );
  };

  const inventoryItemTemplate = (option: InventoryItem) => {
    return (
      <div className="flex items-center py-1 px-2">
        <span>{option.name}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label
          htmlFor="quotation"
          className="text-sm font-medium block mb-1"
        >
          Quotation
        </Label>
        <Input id="quotation" type="file" className="w-full" />
      </div>

      <div>
        <Label
          htmlFor="assignees"
          className="text-sm font-medium block mb-1"
        >
          Assignees
        </Label>
        <div className="w-full">
          <MultiSelect
            value={selectedAssignees}
            onChange={(e: MultiSelectChangeEvent) =>
              setSelectedAssignees(e.value)
            }
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
      </div>

      <div>
        <Label
          htmlFor="tasks"
          className="text-sm font-medium block mb-1"
        >
          Tasks
        </Label>
        <div className="flex items-center gap-2">
          <InputField
            id="tasks"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a task"
            className="w-full"
          />
          <Button
            type="button"
            onClick={addTask}
            className="bg-green-600 hover:bg-green-700 h-10 w-10 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {tasks.length > 0 && (
          <div className="mt-2 space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
              >
                <span>{task.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(task.id)}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label
          htmlFor="inventory"
          className="text-sm font-medium block mb-1"
        >
          Inventory Items
        </Label>
        <div className="w-full">
          <MultiSelect
            value={selectedItems}
            onChange={(e: MultiSelectChangeEvent) =>
              setSelectedItems(e.value)
            }
            options={inventoryItems}
            optionLabel="name"
            placeholder="Select inventory items"
            maxSelectedLabels={3}
            className="prime-multiselect w-full h-11"
            itemTemplate={inventoryItemTemplate}
            style={{ width: "100%" }}
            appendTo="self"
            filter={true}
            showClear={true}
            panelClassName="prime-panel"
          />
        </div>
      </div>
    </div>
  );
}