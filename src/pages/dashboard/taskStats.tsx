import { useMemo } from "react";
import {
  useGetTaskCountsByStatus,
  useGetTaskStatusCount,
} from "@/api/dashboardApi";
import {useGetAllEvents } from "@/api/eventApi";
import { ClipboardList, Play, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: "blue" | "orange" | "purple" | "red" | "green" | "yellow" | "indigo";
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  color = "blue",
}: StatCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

function TaskStats() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  // Use the appropriate API based on role
  const {
    data: teamData,
    isLoading: isTeamLoading,
    error: teamError,
  } = useGetTaskCountsByStatus(role !== "client" ? userId : "");

  const {
    data: clientData,
    isLoading: isClientLoading,
    error: clientError,
  } = useGetTaskStatusCount();

  const {
    data: clientEventData,
    isLoading: isEventLoading,
    error: eventError,
  } = useGetAllEvents(1, 1);

  const counts = useMemo(() => {
    const initial = {
      "To Do": 0,
      "In Progress": 0,
      Completed: 0,
    };

    const sourceData = role === "client" ? clientData?.data : teamData?.data;
    if (!sourceData) return initial;

    for (const { status, count } of sourceData) {
      if (status === "To Do") initial["To Do"] = count;
      else if (status === "In Progress") initial["In Progress"] = count;
      else if (status === "Completed") initial["Completed"] = count;
    }
    return initial;
  }, [role, teamData, clientData]);

  const isLoading = role === "client" ? isClientLoading : isTeamLoading;
  const error = role === "client" ? clientError : teamError;

  const handleCardClick = (status: string) => {
    if (role === "client") {
      const eventId = clientEventData?.events?.[0]?._id;
      if (eventId) {
        navigate(
          `/events/${eventId}/edit?status=${encodeURIComponent(status)}`
        );
      }
    } else {
      navigate(`/tasks?status=${encodeURIComponent(status)}`);
    }
  };
  

  if (isLoading || isEventLoading) {
    return (
      <div className="text-sm text-gray-500">Loading task statistics...</div>
    );
  }

  if (error || eventError) {
    return (
      <div className="text-red-500 font-medium">
        Failed to load task statistics.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div onClick={() => handleCardClick("To Do")} className="cursor-pointer">
        <StatCard
          title="To Do Tasks"
          value={counts["To Do"]}
          icon={ClipboardList}
          description="Tasks ready to start"
          color="blue"
        />
      </div>
      <div
        onClick={() => handleCardClick("In Progress")}
        className="cursor-pointer"
      >
        <StatCard
          title="In Progress"
          value={counts["In Progress"]}
          icon={Play}
          description="Tasks currently being worked on"
          color="orange"
        />
      </div>
      <div
        onClick={() => handleCardClick("Completed")}
        className="cursor-pointer"
      >
        <StatCard
          title="Completed Tasks"
          value={counts["Completed"]}
          icon={CheckCircle}
          description="Successfully finished tasks"
          color="green"
        />
      </div>
    </div>
  );
}

export default TaskStats;
