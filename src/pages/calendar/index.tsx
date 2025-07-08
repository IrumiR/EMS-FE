import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsCalendar from "./eventsCalendar";
import TasksCalendar from "./tasksCalendar";

const TabbedCalendar = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-6">
          <EventsCalendar />
        </TabsContent>
        <TabsContent value="tasks" className="mt-6">
          <TasksCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabbedCalendar;
