import { Label } from "@/components/ui/label";
import InputField from "../atoms/inputField";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Clock, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepProps } from "../types/addEventTypes";
import { useGetClientOptions } from "@/api/authApi";
import DatePickerComponent from "../atoms/datePicker";

interface DateLocationStepProps extends StepProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
 startTime: Date | undefined;
  setStartTime: (time: Date | undefined) => void;
  endTime: Date | undefined;
  setEndTime: (time: Date | undefined) => void;
  location: string;
  setLocation: (location: string) => void;
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
}

export function DateLocationStep({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  location,
  setLocation,
  selectedClientId,
  setSelectedClientId,
}: DateLocationStepProps) {
  const { data: clientsData, isLoading: clientsLoading } = useGetClientOptions();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="start-date"
            className="text-sm font-medium block mb-1"
          >
            Start Date
          </Label>
          <DatePickerComponent
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date ?? undefined)}
            dateFormat="MMMM d, yyyy"
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholderText="Pick a date"
          />
        </div>
        <div>
          <Label htmlFor="end-date" className="text-sm font-medium block mb-1">
            End Date
          </Label>
          <DatePickerComponent
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date ?? undefined)}
            dateFormat="MMMM d, yyyy"
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholderText="Pick a date"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="start-time"
            className="text-sm font-medium block mb-1"
          >
            Start Time
          </Label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <PrimeCalendar
              id="start-time"
              value={startTime ?? null}
              onChange={(e) => setStartTime(e.value ?? undefined)}
              timeOnly
              hourFormat="12"
              className="w-full border-none p-0"
              inputClassName="border-none p-0 h-6 text-sm focus:outline-none"
              panelStyle={{ fontSize: "0.875rem" }}
              style={{ height: "22px" }}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="end-time" className="text-sm font-medium block mb-1">
            End Time
          </Label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <PrimeCalendar
              id="end-time"
              value={endTime ?? null}
              onChange={(e) => setEndTime(e.value ?? undefined)}
              timeOnly
              hourFormat="12"
              className="w-full border-none p-0"
              inputClassName="border-none p-0 h-6 text-sm focus:outline-none"
              panelStyle={{ fontSize: "0.875rem" }}
              style={{ height: "22px" }}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="location" className="text-sm font-medium block mb-1">
          Location
        </Label>
        <InputField
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="client" className="text-sm font-medium block mb-1">
          Client
        </Label>
        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clientsLoading ? (
              <SelectItem value="loading" disabled>
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading clients...
                </div>
              </SelectItem>
            ) : clientsData?.clients?.length ? (
              clientsData.clients.map((client) => (
                <SelectItem key={client.userId} value={client.userId}>
                  {client.userName}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-clients" disabled>
                No clients available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}