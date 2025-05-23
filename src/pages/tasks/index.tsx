import TaskCard from "@/components/molecules/taskCard";
import { AddTaskDialog } from "@/components/organisms/addTaskDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { HiSearch } from "react-icons/hi";
import { Task, useGetAllTasksByEventId } from "@/api/taskApi";
import { useEffect, useState } from "react";

 
function TasksScreen() {

  const { data, isLoading } = useGetAllTasksByEventId("") 
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks);
    }
  }, [data]);
  console.log(data, "data");

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
          <AddTaskDialog />
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

       <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={{
                id: task._id,
                taskName: task.taskName,
                taskDescription: task.taskDescription ?? "",
                status: task.status ?? "",
                startDate: task.startDate,
                endDate: task.endDate,
                priority: task.priority || "",
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No tasks found for this event.
          </p>
        )}
      </div>
    </div>
  );
}

export default TasksScreen;