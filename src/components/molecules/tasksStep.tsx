import { Label } from "@/components/ui/label";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useGetAssigneeOptions,  } from "@/api/authApi";
import { Assignee, InventoryItem, StepProps } from "../types/addEventTypes";
import { useGetInventoryOptions } from "@/api/inventoryApi";

export interface Task {
  id: string;
  name: string;
}

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
  
  const inventoryItems = Array.isArray(inventoryData?.items)
  ? inventoryData.items.map(item => ({
      name: item.itemName,
      id: item.itemId,
    }))
  : [];
console.log("Mapped Inventory Items for MultiSelect:", inventoryItems);
  

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
        <Label htmlFor="assignees" className="text-sm font-medium block mb-1">
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
              assigneesLoading ? "Loading assignees..." : "Select assignees"
            }
            maxSelectedLabels={3}
            className="prime-multiselect w-full h-11 placeholder:text-sm"
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
        <Label htmlFor="inventory" className="text-sm font-medium block mb-1">
          Inventory Items
        </Label>
        <div className="w-full">
          <MultiSelect
            value={selectedItems}
            onChange={(e: MultiSelectChangeEvent) => setSelectedItems(e.value)}
            options={inventoryItems}
            optionLabel="name"
            dataKey="id"
            placeholder={
              inventoryLoading
                ? "Loading inventory items..."
                : "Select inventory items"
            }
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