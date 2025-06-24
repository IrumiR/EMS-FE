import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventStats from "@/pages/dashboard/eventStats";
import UserStats from "@/pages/dashboard/userStats";
import TaskStats from "@/pages/dashboard/taskStats";
import InventoryStats from "@/pages/dashboard/inventoryStats";
import BudgetStats from "@/pages/dashboard/budgetStats";
import UpcomingEventsCard from "@/pages/dashboard/upcomingEventsCard";
import UpcomingTasksCard from "./upcomingTasksCard";
import EventCountByMonth from "./eventCountByMonth";
import UserRole from "./userRole";
import EventStatus from "./eventStatus";
import TaskStatusCount from "./taskStatusCountCard";

function DashboardScreen() {
  const userType = localStorage.getItem("role");

  return (
    <div className="p-6 w-full  mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Plan, prioritize & accomplish your tasks with ease.
        </p>
      </div>

      <Tabs
        defaultValue="events"
        className="w-full bg-white border shadow transition-shadow px-4 py-4 rounded-lg"
      >
        <TabsList
          className={`grid w-full mb-6 ${
            userType === "client"
              ? "grid-cols-2"
              : userType === "team-member" || userType === "manager"
              ? "grid-cols-5"
              : "grid-cols-4"
          }`}
        >
          {(userType === "team-member" || userType === "manager") && (
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          )}
          <TabsTrigger value="events">Events</TabsTrigger>
          {userType !== "client" && (
            <TabsTrigger value="users">Users</TabsTrigger>
          )}
          {userType !== "client" && (
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          )}
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        {(userType === "team-member" || userType === "manager") && (
          <TabsContent value="tasks" className="space-y-4">
            <TaskStats />
          </TabsContent>
        )}

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <EventStats />
        </TabsContent>

        {/* Users Tab */}
        {userType !== "client" && (
          <TabsContent value="users" className="space-y-4">
            <UserStats />
          </TabsContent>
        )}

        {/* Inventory Tab */}
        {userType !== "client" && (
          <TabsContent value="inventory" className="space-y-4">
            <InventoryStats />
          </TabsContent>
        )}

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <BudgetStats />
        </TabsContent>
      </Tabs>

      {userType !== "client" && (
        <div className="mt-10">
          <UpcomingEventsCard />
        </div>
      )}

      {userType == "client" && (
        <div className="mt-10">
          <UpcomingTasksCard />
        </div>
      )}
      {userType !== "client" && (
        <div className="mt-10">
          <EventCountByMonth />
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-6">
        {userType == "admin" && (
          <div className="">
            <UserRole />
          </div>
        )}

        {userType == "client" && (
          <div className="">
            <TaskStatusCount />
          </div>
        )}

        <EventStatus />
      </div>
    </div>
  );
}

export default DashboardScreen;
