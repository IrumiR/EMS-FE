import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Nullable } from "primereact/ts-helpers";
import {
  Assignee,
  EventType,
  InventoryItem,
  StepType,
  Task,
} from "../types/addEventTypes";
import { ProgressSteps } from "../molecules/progressSteps";
import { EventDetailsStep } from "../molecules/eventDetailsStep";
import { DateLocationStep } from "../molecules/dateLocationStep";
import { TasksAssigneesStep } from "../molecules/tasksStep";
import { CreateEventData, useCreateEvent } from "@/api/eventApi";
import toast from "react-hot-toast";

export function AddEventDialog() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Step navigation state
  const [activeStep, setActiveStep] = useState<StepType>("details");

  // Event details step state
  const [eventName, setEventName] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<EventType>("");
  const [customEventType, setCustomEventType] = useState("");
  const [description, setDescription] = useState("");

  // Date and location step state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
 const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");

  // Tasks and assignees step state
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const userId = localStorage.getItem("userId");

  const resetForm = () => {
    // Reset step
    setActiveStep("details");
    
    // Reset event details
    setEventName("");
    setSelectedEventType("");
    setCustomEventType("");
    setDescription("");
    
    // Reset date and location
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime(undefined);
    setEndTime(undefined);
    setLocation("");
    setSelectedClientId("");
    
    // Reset tasks and assignees
    setTaskInput("");
    setTasks([]);
    setSelectedAssignees([]);
    setSelectedItems([]);
  };



  const createEvent = useCreateEvent(
    (message) => {
      console.log(message);
       toast.success("Event created successfully");
      resetForm();
      setIsDialogOpen(false);
    },
    (message) => {
      console.error(message);
       toast.error("Failed to create event");
    }
  );

  const handleSubmit = () => {
      console.log("Selected Inventory Items Before Submit:", selectedItems);
    const payload: CreateEventData = {
      eventName,
      eventType: [
        (selectedEventType as string) === "Other"
          ? customEventType
          : selectedEventType,
      ],
      eventDescription: description,
      startDate: startDate ? startDate.toISOString() : "",
      endDate: endDate ? endDate.toISOString() : "",
      startTime: startTime ? startTime.toISOString() : "",
      endTime: endTime ? endTime.toISOString() : "",
      proposedLocation: location,
      status: "Pending Approval",
      clientId: selectedClientId,
      assignees: selectedAssignees.map((assignee) => assignee.id),
      tasks: [],
      // tasks: tasks.map((task) => ({
      //   taskName: task.taskName,
      //   assigneeId: task.assigneeId,
      //   commentId: task.commentId,
      // })),
      inventoryItems: selectedItems.map((item) => item.id),
      createdBy: userId || "",
    };
     console.log("Payload being sent:", payload);

    createEvent.mutate(payload);
  };

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

   const handleCancel = () => {
    resetForm();
    setIsDialogOpen(false);
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
          <ProgressSteps activeStep={activeStep} />

          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-4 pb-6">
              {/* Event Details Step */}
              {activeStep === "details" && (
                <EventDetailsStep
                  eventName={eventName}
                  setEventName={setEventName}
                  selectedEventType={selectedEventType}
                  setSelectedEventType={setSelectedEventType}
                  customEventType={customEventType}
                  setCustomEventType={setCustomEventType}
                  description={description}
                  setDescription={setDescription}
                  onNext={handleNextStep}
                  onPrevious={() => {}}
                />
              )}

              {/* Date and Location Step */}
              {activeStep === "date" && (
                <DateLocationStep
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  location={location}
                  setLocation={setLocation}
                  selectedClientId={selectedClientId}
                  setSelectedClientId={setSelectedClientId}
                  onNext={handleNextStep}
                  onPrevious={handlePreviousStep}
                />
              )}

              {/* Tasks and Assignees Step */}
              {activeStep === "guests" && (
                <TasksAssigneesStep
                  taskInput={taskInput}
                  setTaskInput={setTaskInput}
                  tasks={tasks.map((t) => ({
                    id: t.taskName,
                    name: t.taskName,
                  }))} // mapping to expected format
                  setTasks={(newTasks) => {
                    setTasks(
                      newTasks.map((t) => ({
                        taskName: t.name, // map back to original format
                        assigneeId: "defaultId",
                        commentId: "defaultComment",
                      }))
                    );
                  }}
                  selectedAssignees={selectedAssignees}
                  setSelectedAssignees={setSelectedAssignees}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  onNext={handleSubmit}
                  onPrevious={handlePreviousStep}
                />
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            className="text-gray-600"
            onClick={activeStep !== "details" ? handlePreviousStep : handleCancel}
          >
            {activeStep !== "details" ? "Back" : "Cancel"}
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            onClick={activeStep !== "guests" ? handleNextStep : handleSubmit}
          >
            {activeStep === "guests" ? "Create Event" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}