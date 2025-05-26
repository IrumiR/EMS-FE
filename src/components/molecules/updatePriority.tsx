import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useApproveTaskPriority } from "@/api/taskApi";
import toast from "react-hot-toast";
import { Loader2, SquareChevronUp } from "lucide-react";

interface PrioritySelectProps {
  taskId: string;
  priority: string;
}

const priorityOptions = ["High", "Medium", "Low"];

export default function TaskPrioritySelect({ taskId, priority }: PrioritySelectProps) {
  const [selectedPriority, setSelectedPriority] = useState(priority);

  useEffect(() => {
    setSelectedPriority(priority); 
  }, [priority]);

  const { mutate: approveTask, isLoading } = useApproveTaskPriority(
    () => {
      toast.success(`Priority updated successfully`);
    },
    (errMsg) => {
      toast.error(`Failed to update priority: ${errMsg}`);
    }
  );

  const handleChange = (value: string) => {
    setSelectedPriority(value);
    approveTask({ taskId, priority: { priority: value } });
  };

  return (
      <Select onValueChange={handleChange} value={selectedPriority}>
        <SelectTrigger className="w-fit h-fit border-none bg-transparent p-0 shadow-none hover:bg-transparent focus:ring-0">
        <SquareChevronUp className="w-4 h-4 text-gray-500 cursor-pointer" />
      </SelectTrigger>
        <SelectContent>
          {priorityOptions.map((priorityOption) => (
            <SelectItem key={priorityOption} value={priorityOption}>
              {isLoading && selectedPriority === priorityOption ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-1" />
                  Updating...
                </div>
              ) : (
                priorityOption
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
}