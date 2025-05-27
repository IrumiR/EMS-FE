import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useApproveTask } from "@/api/taskApi";
import toast from "react-hot-toast";
import { Loader2, Check } from "lucide-react";
import { CircleChevronUp } from 'lucide-react';

interface StatusSelectProps {
  taskId: string;
  status: string;
}

const statusOptions = ["To Do", "In Progress", "Over Due", "Completed", "Cancelled"];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "to do":
      return "text-blue-600";
    case "in progress":
      return "text-green-600";
    case "over due":
      return "text-red-600";
    case "completed":
      return "text-purple-600";
    case "cancelled":
      return "text-gray-600";
    default:
      return "text-gray-500";
  }
};

export default function TaskStatusSelect({ taskId, status }: StatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedStatus(status); 
  }, [status]);

  const { mutate: approveTask, isLoading } = useApproveTask(
    () => {
      toast.success(`Status updated successfully`);
      setOpen(false);
    },
    (errMsg) => {
      toast.error(`Failed to update status: ${errMsg}`);
    }
  );

  const handleStatusChange = (value: string) => {
    if (value !== selectedStatus) {
      setSelectedStatus(value);
      approveTask({ taskId, status: { status: value } });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-fit h-fit border-none bg-transparent p-1 shadow-none hover:bg-gray-100 focus:ring-0 focus:ring-offset-0 rounded transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
          ) : (
            <CircleChevronUp className={`w-4 h-4 cursor-pointer ${getStatusColor(selectedStatus)}`} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Update Status
          </div>
          {statusOptions.map((statusOption) => (
            <Button
              key={statusOption}
              variant="ghost"
              size="sm"
              className={`w-full justify-start text-left font-normal ${getStatusColor(statusOption)} hover:bg-gray-100`}
              onClick={() => handleStatusChange(statusOption)}
              disabled={isLoading}
            >
              <div className="flex items-center justify-between w-full">
                <span>{statusOption}</span>
                {selectedStatus === statusOption && (
                  <Check className="w-4 h-4" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}