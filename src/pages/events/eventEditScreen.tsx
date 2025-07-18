import TaskCard from "@/components/molecules/taskCard";
import { AddTaskDialog } from "@/components/organisms/addTaskDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { HiSearch } from "react-icons/hi";
import {  useGetAllTasksByEventId } from "@/api/taskApi";
import { useParams, useSearchParams } from "react-router-dom";
import {  useEffect, useState } from "react";

function EventEditScreen() {
  const { eventId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const { data, isLoading } = useGetAllTasksByEventId(
    eventId ?? "",
    currentPage,
    rowsPerPage,
    searchTerm,
    selectedStatus === "All Statuses" ? undefined : selectedStatus
  );

   const userType = localStorage.getItem("role");


   const tasks = data?.tasks || [];
   const totalTasks = data?.pagination.total || 0;
   const totalPages = Math.ceil(totalTasks / rowsPerPage);

   const [searchParams] = useSearchParams();
    const prefillStartDate = searchParams.get("startDate");
    const prefillEndDate = searchParams.get("endDate");

   useEffect(() => {
     const status = searchParams.get("status");
     if (
       status === "To Do" ||
       status === "In Progress" ||
       status === "Completed" ||
       status === "Cancelled"
     ) {
       setSelectedStatus(status);
     }
   }, [searchParams]);


   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     setSearchTerm(event.target.value);
     setCurrentPage(1);
   };

   const handleStatusChange = (status: string) => {
     setSelectedStatus(status);
     setCurrentPage(1);
   };

   const handlePageChange = (newPage: number) => {
     if (newPage >= 1 && newPage <= totalPages) {
       setCurrentPage(newPage);
     }
   };

   const handleRowsPerPageChange = (
     event: React.ChangeEvent<HTMLSelectElement>
   ) => {
     const newRowsPerPage = Number(event.target.value);
     setRowsPerPage(newRowsPerPage);
     setCurrentPage(1); // Reset to first page when changing page size
   };

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
          {userType !== "client" && userType !== "team-member" && (
            <AddTaskDialog
              prefillStartDate={prefillStartDate}
              prefillEndDate={prefillEndDate}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                {selectedStatus}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleStatusChange("All Statuses")}
              >
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("To Do")}>
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("In Progress")}
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("Cancelled")}>
                Cancelled
              </DropdownMenuItem>
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
                subTasks: Array.isArray(task.subTasks)
                  ? task.subTasks.map((subTask: any) => ({
                      name: subTask.subTaskName ?? "",
                    }))
                  : [],
                eventId: task.eventId ?? "",
                assignees: (task.assignees ?? []).map((a) => ({
                  assigneeId: a.assigneeId ?? "",
                })),
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            {searchTerm || selectedStatus !== "All Statuses"
              ? "No tasks match your current filters."
              : "No tasks found for this event."}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Tasks per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            {[5, 10, 15, 20, 25].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default EventEditScreen;