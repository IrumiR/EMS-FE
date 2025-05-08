import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputField from "../atoms/inputField";
import { CalendarIcon, Clock, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Nullable } from "primereact/ts-helpers";
import wedding from "../../assets/images/wedding.png";
import birthday from "../../assets/images/birthday.png";  
import sports from "../../assets/images/sports.png";
import conference from "../../assets/images/conference.png";  
import concert from "../../assets/images/concert.png";
import charity from "../../assets/images/charity.png";  
import corporate from "../../assets/images/corporate.png";
import others from "../../assets/images/others.png";  

interface Assignee {
  name: string;
  id: string;
}

interface InventoryItem {
  name: string;
  id: string;
}

interface Task {
  id: string;
  name: string;
}

export function AddEventDialog() {
  const [activeStep, setActiveStep] = useState("details");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<Nullable<Date>>(null);
  const [endTime, setEndTime] = useState<Nullable<Date>>(null);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);

  const [selectedEventType, setSelectedEventType] = useState<keyof typeof eventTypeImages | "">("");
  const [customEventType, setCustomEventType] = useState("");

  const eventTypeImages = {
    wedding: wedding,
    birthday: birthday,
    concert: concert,
    conference: conference,
    sports: sports,
    corporate: corporate,
    charity: charity,
    others: others,
  };

  const assignees: Assignee[] = [
    { name: "John Doe", id: "jdoe" },
    { name: "Jane Smith", id: "jsmith" },
    { name: "Robert Johnson", id: "rjohnson" },
    { name: "Emily Davis", id: "edavis" },
    { name: "Michael Wilson", id: "mwilson" },
  ];

  const inventoryItems: InventoryItem[] = [
    { name: "Laptop", id: "laptop" },
    { name: "Projector", id: "projector" },
    { name: "Whiteboard", id: "whiteboard" },
    { name: "Markers", id: "markers" },
    { name: "Chairs", id: "chairs" },
  ];

  const handleNextStep = () => {
    if (activeStep === "details") {
      setActiveStep("date");
    } else if (activeStep === "date") {
      setActiveStep("guests");
    }
  };

  const handlePreviousStep = () => {
    if (activeStep === "date") {
      setActiveStep("details");
    } else if (activeStep === "guests") {
      setActiveStep("date");
    }
  };

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

  const getStepTitle = () => {
    switch (activeStep) {
      case "details":
        return "What's your event about?";
      case "date":
        return "When and where will it take place?";
      case "guests":
        return "Who should complete the tasks?";
      default:
        return "What's your event about?";
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
    <Dialog>
      <DialogTrigger className="flex gap-1 bg-green-600 py-2 pl-2 sm:pr-2 pr-2 items-center rounded-md text-white max-h-[38px] text-xsxl">
        <div className="flex items-center gap-1">
          <Plus strokeWidth={1.4} />
          <span className="hidden xl:inline">Add Event</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[100vh]">
        <div className="mb-6">
          <div className="flex items-center">
            <div className="text-sm font-medium">
              <h2 className="text-lg font-semibold mb-4">{getStepTitle()}</h2>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between w-full mb-6 gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`h-1 w-28 rounded-full ${
                  activeStep === "details" ? "bg-green-600" : "bg-gray-200"
                }`}
              />
              <span
                className={`text-xs mt-1 block text-center ${
                  activeStep === "details"
                    ? "text-green-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                Details
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`h-1 w-28 rounded-full ${
                  activeStep === "date" ? "bg-green-600" : "bg-gray-200"
                }`}
              />
              <span
                className={`text-xs mt-1 block text-center ${
                  activeStep === "date"
                    ? "text-green-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                Date and location
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`h-1 w-28 rounded-full ${
                  activeStep === "guests" ? "bg-green-600" : "bg-gray-200"
                }`}
              />
              <span
                className={`text-xs mt-1 block text-center ${
                  activeStep === "guests"
                    ? "text-green-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                Tasks and assignees
              </span>
            </div>
          </div>

          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-4 pb-6">
          {/* Form Fields - Details Step */}
          {activeStep === "details" && (
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
                  onValueChange={(value) => setSelectedEventType(value as keyof typeof eventTypeImages | "")}
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
                  placeholder="Add a description to encourage guests to attend to your event. Links, emojis and new lines are supported."
                  className="w-full min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Form Fields - Date and Location Step */}
          {activeStep === "date" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="start-date"
                    className="text-sm font-medium block mb-1"
                  >
                    Start Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label
                    htmlFor="end-date"
                    className="text-sm font-medium block mb-1"
                  >
                    End Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                      value={startTime}
                      onChange={(e) => setStartTime(e.value)}
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
                  <Label
                    htmlFor="end-time"
                    className="text-sm font-medium block mb-1"
                  >
                    End Time
                  </Label>
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <PrimeCalendar
                      id="end-time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.value)}
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
                <Label
                  htmlFor="location"
                  className="text-sm font-medium block mb-1"
                >
                  Location
                </Label>
                <InputField
                  id="location"
                  placeholder="Enter location"
                  className="w-full"
                />
              </div>

              <div>
                <Label
                  htmlFor="status"
                  className="text-sm font-medium block mb-1"
                >
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="tentative">Tentative</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="client"
                  className="text-sm font-medium block mb-1"
                >
                  Client
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">Client 1</SelectItem>
                    <SelectItem value="client2">Client 2</SelectItem>
                    <SelectItem value="client3">Client 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Form Fields - Tasks and Assignees Step */}
          {activeStep === "guests" && (
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
                    placeholder="Select assignees"
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
          )}
          </div>
             </ScrollArea>
        </div>
     
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            className="text-gray-600"
            onClick={activeStep !== "details" ? handlePreviousStep : undefined}
          >
            {activeStep !== "details" ? "Back" : "Cancel"}
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            onClick={activeStep !== "guests" ? handleNextStep : undefined}
          >
            {activeStep === "guests" ? "Create Event" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
