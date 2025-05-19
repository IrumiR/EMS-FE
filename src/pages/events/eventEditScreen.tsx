import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetailsStep from "@/components/molecules/updateEventDetails";
import TasksAndAssigneesStep from "@/components/molecules/updateTaskAssignees";
import { useParams } from "react-router-dom";
import { useGetEventById } from "@/api/eventApi";

function EventEditScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data, isLoading, error } = useGetEventById(eventId ?? null);

  const [activeStep, setActiveStep] = useState("details");

  const [eventData, setEventData] = useState({
    eventTitle: "",
    eventType: "",
    status: "",
    description: "",
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    location: "",
    client: "",
    quotation: null,
    tasks: [{
      id: 1,
      name: "",
      assignee: "",
      status: "pending",
      progress: 0,
      inventoryItems: [{ id: 1, name: "", quantity: 1 }],
      comments: [],
      subTasks: [],
    }]
  });

  useEffect(() => {
    if (data?.event) {
      const apiEvent = data.event;

      setEventData(prev => ({
        ...prev,
        eventTitle: apiEvent.eventName || "",
        eventType: Array.isArray(apiEvent.eventType) ? apiEvent.eventType[0] : "",
        status: apiEvent.status || "",
        description: apiEvent.eventDescription || "",
        startDate: apiEvent.startDate ? new Date(apiEvent.startDate) : null,
        endDate: apiEvent.endDate ? new Date(apiEvent.endDate) : null,
        startTime: apiEvent.startTime ? new Date(apiEvent.startTime) : null,
        endTime: apiEvent.endTime ? new Date(apiEvent.endTime) : null,
        location: apiEvent.proposedLocation || "",
        client: apiEvent.clientId?._id || "",
        quotation: apiEvent.quotationId?._id || null,
        tasks: apiEvent.tasks.length > 0 ? apiEvent.tasks : prev.tasks, // retain default if empty
      }));
    }
  }, [data]);

  const handleNextStep = (formValues: Partial<typeof eventData>) => {
    setEventData(prev => ({ ...prev, ...formValues }));
    setActiveStep("tasks");
  };

  const handlePrevStep = () => {
    setActiveStep("details");
  };

  const handleSubmit = (taskData: Partial<typeof eventData>) => {
    const finalData = { ...eventData, ...taskData };
    console.log("Final form data:", finalData);
    // Submit to backend here
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    // Add cancel logic
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeStep} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger
                value="details"
                onClick={() => setActiveStep("details")}
                className={activeStep === "details" ? "border-b-2 border-green-500" : ""}
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                onClick={() => setActiveStep("tasks")}
                className={activeStep === "tasks" ? "border-b-2 border-green-500" : ""}
                disabled={!eventData.eventTitle}
              >
                Tasks and assignees
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <EventDetailsStep
                initialData={eventData}
                onNext={handleNextStep}
                onCancel={handleCancel}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <TasksAndAssigneesStep
                initialData={eventData}
                onSubmit={handleSubmit}
                onBack={handlePrevStep}
                onCancel={handleCancel}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventEditScreen;
