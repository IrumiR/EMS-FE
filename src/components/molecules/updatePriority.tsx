import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useApproveTaskPriority } from "@/api/taskApi";
import toast from "react-hot-toast";
import { Loader2, SquareChevronUp } from "lucide-react";
import clsx from "clsx";

interface PrioritySelectProps {
  taskId: string;
  priority: string;
}

const priorityOptions = ["High", "Medium", "Low"];

export default function TaskPrioritySelect({ taskId, priority }: PrioritySelectProps) {
  const [selectedPriority, setSelectedPriority] = useState(priority);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedPriority(priority);
  }, [priority]);

  const { mutate: approveTask, isLoading } = useApproveTaskPriority(
    () => {
      toast.success(`Priority updated successfully`);
      setOpen(false);
    },
    (errMsg) => {
      toast.error(`Failed to update priority: ${errMsg}`);
    }
  );

  const handleChange = (value: string) => {
    if (value === selectedPriority) {
      setOpen(false);
      return;
    }
    setSelectedPriority(value);
    approveTask({ taskId, priority: { priority: value } });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-1 bg-transparent border-none hover:bg-gray-100 focus:outline-none">
          <SquareChevronUp className="w-4 h-4 text-gray-500 cursor-pointer" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-28 p-1 space-y-1">
        {priorityOptions.map((priorityOption) => (
          <button
            key={priorityOption}
            onClick={() => handleChange(priorityOption)}
            className={clsx(
              "w-full text-left px-2 py-1 text-sm rounded-md hover:bg-gray-100 flex items-center",
              selectedPriority === priorityOption && "bg-gray-100 font-medium"
            )}
            disabled={isLoading && selectedPriority === priorityOption}
          >
            {isLoading && selectedPriority === priorityOption ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-1" />
                Updating...
              </>
            ) : (
              priorityOption
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
