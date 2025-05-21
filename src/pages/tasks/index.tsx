import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiPlus, HiSearch } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddTaskDialog } from "@/components/organisms/addTaskDialog";

function TasksScreen() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="mt-4 text-gray-600">
            Manage and track your tasks here.
          </p>
        </div>

        <div>
          <AddTaskDialog/>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search tasks..." className="pl-10 w-full" />
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                All Statuses
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="my-tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="team-tasks">Team Tasks</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {/* All tasks content goes here */}
          </TabsContent>
          <TabsContent value="my-tasks">
            {/* My tasks content goes here */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default TasksScreen;
