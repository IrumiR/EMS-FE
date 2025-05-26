import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useApproveTask } from "@/api/taskApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { CircleChevronUp } from 'lucide-react';

interface StatusSelectProps {
  taskId: string;
  status: string;
}

const statusOptions = ["To Do", "In Progress", "Over Due", "Completed", "Cancelled"];

export default function TaskStatusSelect({ taskId, status }: StatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState(status);

  useEffect(() => {
    setSelectedStatus(status); 
  }, [status]);

  const { mutate: approveTask, isLoading } = useApproveTask(
    () => {
      toast.success(`Status updated successfully`);
    },
    (errMsg) => {
      toast.error(`Failed to update status: ${errMsg}`);
    }
  );

  const handleChange = (value: string) => {
    setSelectedStatus(value);
    approveTask({ taskId, status: { status: value } });
  };

  return (
      <Select onValueChange={handleChange} value={selectedStatus}>
        <SelectTrigger className="w-fit h-fit border-none bg-transparent p-0 shadow-none hover:bg-transparent focus:ring-0">
        <CircleChevronUp className="w-4 h-4 text-gray-500 cursor-pointer" />
      </SelectTrigger>
        <SelectContent>
          {statusOptions.map((statusOption) => (
            <SelectItem key={statusOption} value={statusOption}>
              {isLoading && selectedStatus === statusOption ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-1" />
                  Updating...
                </div>
              ) : (
                statusOption
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
}