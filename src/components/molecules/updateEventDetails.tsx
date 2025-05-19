import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UpdateEventDetailsStepProps {
  initialData: {
    eventTitle?: string;
    eventType?: string;
    status?: string;
    description?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    startTime?: Date | null;
    endTime?: Date | null;
    location?: string;
    client?: string;
    quotation?: File | null;
  };
  onNext: (data: any) => void;
  onCancel: () => void;
}

function UpdateEventDetailsStep({ initialData, onNext, onCancel }: UpdateEventDetailsStepProps) {
  const [eventTitle, setEventTitle] = useState(initialData.eventTitle || "");
  const [eventType, setEventType] = useState(initialData.eventType || "");
  const [status, setStatus] = useState(initialData.status || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [endDate, setEndDate] = useState(initialData.endDate);
  const [startTime, setStartTime] = useState(initialData.startTime);
  const [endTime, setEndTime] = useState(initialData.endTime);
  const [location, setLocation] = useState(initialData.location || "");
  const [client, setClient] = useState(initialData.client || "");
  const [quotation, setQuotation] = useState(initialData.quotation);

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Collect data from this step
    const data = {
      eventTitle,
      eventType,
      status,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      client,
      quotation
    };
    
    // Pass data to parent component
    onNext(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQuotation(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleNext}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Title */}
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="eventTitle">Event Title</Label>
          <Input 
            id="eventTitle" 
            value={eventTitle} 
            onChange={(e) => setEventTitle(e.target.value)} 
            className="w-full mt-1" 
            required
            placeholder="Enter event title"
          />
        </div>

        {/* Event Type */}
        <div>
          <Label htmlFor="eventType">Event Type</Label>
          <Select 
            value={eventType} 
            onValueChange={setEventType}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select an event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
              <SelectItem value="corporate">Corporate Event</SelectItem>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="party">Party</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={status} 
            onValueChange={setStatus}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending approval">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
              <SelectItem value="hold">Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={3} 
            className="w-full mt-1"
            placeholder="Add a description to encourage guests to attend to your event. Links, emojis and new lines are supported."
          />
        </div>

        {/* Start Date */}
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Calendar 
            id="startDate" 
            value={startDate} 
            onChange={(e) => setStartDate(e.value ?? null)} 
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full mt-1" 
            required
          />
        </div>

        {/* End Date */}
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Calendar 
            id="endDate" 
            value={endDate} 
            onChange={(e) => setEndDate(e.value ?? null)} 
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full mt-1" 
            required
          />
        </div>

        {/* Start Time */}
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Calendar 
            id="startTime" 
            value={startTime} 
            onChange={(e) => setStartTime(e.value ?? null)} 
            timeOnly 
            hourFormat="12" 
            showIcon
            className="w-full mt-1" 
            required
          />
        </div>

        {/* End Time */}
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Calendar 
            id="endTime" 
            value={endTime} 
            onChange={(e) => setEndTime(e.value ?? null)} 
            timeOnly 
            hourFormat="12" 
            showIcon
            className="w-full mt-1" 
            required
          />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className="w-full mt-1" 
            required
          />
        </div>

        {/* Client */}
        <div>
          <Label htmlFor="client">Client</Label>
          <Input 
            id="client" 
            value={client} 
            onChange={(e) => setClient(e.target.value)} 
            className="w-full mt-1" 
            required
          />
        </div>

        {/* Quotation File */}
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="quotation">Quotation</Label>
          <Input 
            id="quotation" 
            type="file" 
            accept="application/pdf" 
            className="w-full mt-1"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="default"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Next
        </Button>
      </div>
    </form>
  );
}

export default UpdateEventDetailsStep;