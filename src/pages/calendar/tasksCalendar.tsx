import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { useGetAllTasksByMonth } from "@/api/taskApi"; 
import {useGetAssigneeOptions} from "@/api/authApi";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const yearRange = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

const TasksCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

 const userType = localStorage.getItem("role");
  const userId = localStorage.getItem("userId") || "";
  const role = localStorage.getItem("role");

  let queryUserId = "";
  let queryClientId = "";

 if (role === "client") {
   queryClientId = userId;
 } else if (selectedAssigneeId) {
   queryUserId = selectedAssigneeId;
 } else if (role !== "admin" && role !== "manager") {
   queryUserId = userId;
 }


  const { data, isLoading, isError } = useGetAllTasksByMonth(
    year,
    month,
    queryUserId,
    queryClientId
  );
  const tasks = data?.tasks || {};

  const {
    data: assigneeData,
    isLoading: assigneesLoading,
    isError: assigneesError,
  } = useGetAssigneeOptions();


  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startOffset = getDay(startOfMonth(currentDate));

  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleGoTo = (yearSelected: number, monthSelected: number) => {
    setCurrentDate(new Date(yearSelected, monthSelected - 1));
  };

  if (isLoading) return <div className="p-4">Loading tasks...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading tasks.</div>;

  return (
    <div className="p-2 md:p-4 space-y-4 mx-auto max-w-full overflow-hidden">
      <div className="flex justify-between items-center space-x-4 flex-wrap">
        <Button
          onClick={handlePrevMonth}
          className="bg-green-600 text-xs md:text-sm px-2 md:px-4"
        >
          Previous
        </Button>
        <h2 className="text-lg md:text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button
          onClick={handleNextMonth}
          className="bg-green-600 text-xs md:text-sm px-2 md:px-4"
        >
          Next
        </Button>
      </div>

      <div className="flex items-center space-x-2 flex-wrap text-sm md:text-base">
        <label htmlFor="tasks-month-select" className="font-medium">
          Month:
        </label>
        <select
          id="tasks-month-select"
          value={currentDate.getMonth()}
          onChange={(e) => handleGoTo(year, Number(e.target.value) + 1)}
          className="border rounded px-2 py-1 text-xs md:text-sm"
        >
          {monthNames.map((name, idx) => (
            <option key={name} value={idx}>
              {name}
            </option>
          ))}
        </select>

        <label htmlFor="tasks-year-select" className="font-medium">
          Year:
        </label>
        <select
          id="tasks-year-select"
          value={year}
          onChange={(e) => handleGoTo(Number(e.target.value), month)}
          className="border rounded px-2 py-1 text-xs md:text-sm"
        >
          {yearRange.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>

        {(userType === "admin" || userType === "manager") && (
          <div>
            <label htmlFor="assignee-select" className="font-medium">
              Assignee:
            </label>
            <select
              id="assignee-select"
              value={selectedAssigneeId}
              onChange={(e) => setSelectedAssigneeId(e.target.value)}
              className="border rounded px-2 py-1 text-xs md:text-sm"
            >
              <option value="">All</option>
              {assigneeData?.assignees.map((assignee) => (
                <option key={assignee.userId} value={assignee.userId}>
                  {assignee.userName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-medium text-xs md:text-sm">
        {weekdays.map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startOffset }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}

        {daysInMonth.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayTasks = tasks[dateKey] || [];

          return (
            <div key={dateKey}>
              {/* Mobile View */}
              <div className="md:hidden">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="border rounded-md p-2 min-h-[80px] flex flex-col gap-1 overflow-hidden cursor-pointer hover:bg-gray-50">
                      <div className="text-xs font-semibold">
                        {day.getDate()}
                      </div>
                      {dayTasks.length > 0 && (
                        <div className="text-xs text-purple-600 font-medium">
                          {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </HoverCardTrigger>
                  {dayTasks.length > 0 && (
                    <HoverCardContent className="w-80 p-3">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">
                          {format(day, "MMMM d, yyyy")}
                        </h4>
                        <div className="space-y-3">
                          {dayTasks.map((task, idx) => (
                            <div
                              key={idx}
                              className="border-l-2 border-purple-500 pl-3 py-1"
                            >
                              <p className="font-medium text-sm text-gray-900">
                                {task.taskName}
                              </p>
                              <p className="text-xs text-gray-600">
                                <strong>Status:</strong> {task.status}
                              </p>
                              <p className="text-xs text-gray-600">
                                <strong>Priority:</strong> {task.priority}
                              </p>
                              <p className="text-xs text-gray-600">
                                <strong>Event:</strong> {task.eventName}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </HoverCardContent>
                  )}
                </HoverCard>
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <div className="border rounded-md p-2 min-h-[120px] flex flex-col gap-1 overflow-hidden">
                  <div className="text-sm font-semibold">{day.getDate()}</div>
                  {dayTasks.map((task, idx) => (
                    <Card key={idx} className="bg-purple-50 text-xs">
                      <CardContent className="p-2 space-y-1">
                        <p className="font-medium truncate">{task.taskName}</p>

                        <div
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                         ${
                           task.priority === "High"
                             ? "text-red-500 bg-red-50"
                             : task.priority === "Medium"
                             ? "text-orange-500 bg-orange-50"
                             : "text-green-500 bg-green-50"
                         }
                       `}
                        >
                          <span>
                            {task.priority === "High"
                              ? "⬆"
                              : task.priority === "Medium"
                              ? "⬆"
                              : "⬇"}
                          </span>
                          {task.priority}
                        </div>

                        <div
                          className={`w-fit px-2 py-0.5 rounded-full text-xs font-medium mt-1
                         ${
                           task.status === "To Do"
                             ? "bg-blue-100 text-blue-800"
                             : task.status === "In Progress"
                             ? "bg-green-100 text-green-800"
                             : task.status === "Completed"
                             ? "bg-purple-100 text-purple-800"
                             : "bg-red-100 text-red-800"
                         }
                       `}
                        >
                          {task.status}
                        </div>

                        <p className="truncate text-muted-foreground">
                          {task.eventName}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksCalendar;
