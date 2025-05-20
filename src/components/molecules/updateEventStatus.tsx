import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useApproveEvent } from "@/api/eventApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface StatusSelectProps {
  eventId: string;
  status: string;
}

const statusOptions = ["In Progress", "Hold", "Completed", "Cancelled"];

export default function StatusSelect({ eventId, status }: StatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState(status);

  useEffect(() => {
    setSelectedStatus(status); 
  }, [status]);

  const { mutate: approveEvent, isLoading } = useApproveEvent(
    () => {
      toast.success(`Status updated successfully`);
    },
    (errMsg) => {
      toast.error(`Failed to update status: ${errMsg}`);
    }
  );

  const handleChange = (value: string) => {
    setSelectedStatus(value);
    approveEvent({ eventId, status: { status: value } });
  };

  return (
    <div className="w-[200px]">
      <Select onValueChange={handleChange} value={selectedStatus}>
        <SelectTrigger>
          <SelectValue />
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
    </div>
  );
}