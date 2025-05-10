import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputField from "../atoms/inputField";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventType, StepProps } from "../types/addEventTypes";
import wedding from "../../assets/images/wedding.png";
import birthday from "../../assets/images/birthday.png";
import sports from "../../assets/images/sports.png";
import conference from "../../assets/images/conference.png";
import concert from "../../assets/images/concert.png";
import charity from "../../assets/images/charity.png";
import corporate from "../../assets/images/corporate.png";
import others from "../../assets/images/others.png";

interface EventDetailsStepProps extends StepProps {
  eventName: string;
  setEventName: (value: string) => void;
  selectedEventType: EventType;
  setSelectedEventType: (value: EventType) => void;
  customEventType: string;
  setCustomEventType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

export const eventTypeImages = {
  wedding,
  birthday,
  concert,
  conference,
  sports,
  corporate,
  charity,
  others,
};

export function EventDetailsStep({
  eventName,
  setEventName,
  selectedEventType,
  setSelectedEventType,
  customEventType,
  setCustomEventType,
  description,
  setDescription,
}: EventDetailsStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label
          htmlFor="eventName"
          className="text-sm font-medium block mb-1"
        >
          Event Title
        </Label>
        <InputField
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter event title"
          className="w-full"
        />
      </div>

      <div>
        <Label
          htmlFor="eventType"
          className="text-sm font-medium block mb-1"
        >
          Event Type
        </Label>
        <Select
          value={selectedEventType}
          onValueChange={(value) =>
            setSelectedEventType(value as EventType)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wedding">Wedding</SelectItem>
            <SelectItem value="birthday">Birthday Party</SelectItem>
            <SelectItem value="concert">Concert</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="sports">Sporting Event</SelectItem>
            <SelectItem value="corporate">Corporate Event</SelectItem>
            <SelectItem value="charity">Charity Event</SelectItem>
            <SelectItem value="others">Other Events</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedEventType === "others" && (
        <div>
          <Label
            htmlFor="customEventType"
            className="text-sm font-medium block mb-1"
          >
            Specify Event Type
          </Label>
          <Input
            id="customEventType"
            value={customEventType}
            onChange={(e) => setCustomEventType(e.target.value)}
            placeholder="Enter your event type"
            className="w-full"
          />
        </div>
      )}

      {/* Display the image for the selected event type */}
      {selectedEventType && (
        <div className="flex justify-center mt-2">
          <img
            src={eventTypeImages[selectedEventType]}
            alt={selectedEventType}
            className="h-24 w-auto object-contain"
          />
        </div>
      )}

      <div>
        <Label
          htmlFor="description"
          className="text-sm font-medium block mb-1"
        >
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description to encourage guests to attend to your event. Links, emojis and new lines are supported."
          className="w-full min-h-[100px]"
        />
      </div>
    </div>
  );
}