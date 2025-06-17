import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventStats from '@/pages/dashboard/eventStats';
import UserStats from '@/pages/dashboard/userStats';
import TaskStats from '@/pages/dashboard/taskStats';
import InventoryStats from '@/pages/dashboard/inventoryStats';
import BudgetStats from '@/pages/dashboard/budgetStats';
import UpcomingEventsCard from '@/pages/dashboard/upcomingEventsCard';

function DashboardScreen() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Plan, prioritize & accomplish your tasks with ease.</p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
        <EventStats />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <UserStats />
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <TaskStats />
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <InventoryStats />
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <BudgetStats />
        </TabsContent>
      </Tabs>

      <div className="mt-10">
        <UpcomingEventsCard />
      </div>
    </div>

      
  );
}

export default DashboardScreen;