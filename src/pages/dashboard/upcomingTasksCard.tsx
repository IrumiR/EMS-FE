import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useGetUpcomingTasks } from "@/api/dashboardApi";

const UpcomingTasksCard = () => {
  const { data, isLoading, isError } = useGetUpcomingTasks();
  const tasks = data?.tasks || [];
  const [openTasks, setOpenTasks] = useState<Record<number, boolean>>({});

  const toggleTask = (index: any) => {
    setOpenTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "in progress":
        return "secondary";
      case "to do":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "to do":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <AlertTriangle className="h-3 w-3" />;
      case "medium":
        return <Clock className="h-3 w-3" />;
      case "low":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in progress":
        return <Clock className="h-4 w-4" />;
      case "to do":
        return <CheckSquare className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Upcoming Tasks
        </CardTitle>
        <p className="text-sm text-gray-500">
          An overview of your recent and upcoming tasks
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="w-full">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-12 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </CardContent>
            </Card>
          </div>
        ) : isError ? (
          <p className="text-sm text-red-500">Failed to load tasks</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No upcoming tasks found</p>
            <p className="text-xs mt-1">
              Tasks will appear here once you add them
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <Card
              key={index}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-2"
            >
              <CardContent className="p-2">
                <div className="space-y-3">
                  {/* Task Name and Priority */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {task.taskName || "Task Name"}
                    </h3>

                    <div className="flex gap-3">
                      <Badge
                        className={`${getPriorityColor(
                          task.priority
                        )} shrink-0 w-fit flex items-center gap-1`}
                      >
                        {getPriorityIcon(task.priority)}
                        {task.priority || "Medium"}
                      </Badge>

                      <Badge
                        variant={getStatusVariant(task.status)}
                        className={`${getStatusColor(
                          task.status
                        )} shrink-0 w-fit flex items-center gap-1`}
                      >
                        {getStatusIcon(task.status)}
                        {task.status || "To Do"}
                      </Badge>
                    </div>
                  </div>

                  {/* Status */}

                  {/* Event Name */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Event: </span>
                    {task.eventName || "N/A"}
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span className="text-sm">
                      {formatDate(task.startDate)} - {formatDate(task.endDate)}
                    </span>
                  </div>

                  {/* Subtasks Section */}
                  {task.subTasks && task.subTasks.length > 0 && (
                    <Collapsible
                      open={openTasks[index]}
                      onOpenChange={() => toggleTask(index)}
                    >
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                        {openTasks[index] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span>{task.subTasks.length} Subtasks</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="space-y-2 pl-6 border-l-2 border-gray-200">
                          {task.subTasks.map((subTask, subIndex) => (
                            <div
                              key={subTask._id || subIndex}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                {getStatusIcon(subTask.status)}
                                <span className="text-sm text-gray-700">
                                  {subTask.subTaskName}
                                </span>
                              </div>
                              <Badge
                                variant={getStatusVariant(subTask.status)}
                                className={`${getStatusColor(
                                  subTask.status
                                )} text-xs`}
                              >
                                {subTask.status || "To Do"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTasksCard;
