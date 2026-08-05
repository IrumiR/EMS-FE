import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  CheckCircle,
  Pause,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useGetEventCountByStatus } from "@/api/dashboardApi";
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

function EventStats() {
  const { data, isLoading, error } = useGetEventCountByStatus();
  const eventCounts = data?.data ?? [];
  const navigate = useNavigate();

  const handleCardClick = (status: string | null) => {
    if (status) {
      navigate(`/events?status=${encodeURIComponent(status)}`);
    } else {
      navigate(`/events`);
    }
  };


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-12 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value="Error"
          icon={Calendar}
          description="Failed to load data"
          color="red"
        />
        {/* <StatCard
          title="Approved Events"
          value="Error"
          icon={LaptopMinimalCheck}
          description="Failed to load data"
          color="red"
        /> */}
        <StatCard
          title="In Progress Events"
          value="Error"
          icon={Clock}
          description="Failed to load data"
          color="red"
        />
        <StatCard
          title="Pending Events"
          value="Error"
          icon={Pause}
          description="Failed to load data"
          color="red"
        />
        <StatCard
          title="Completed Events"
          value="Error"
          icon={CheckCircle}
          description="Failed to load data"
          color="red"
        />
      </div>
    );
  }

  const getCountByStatus = (status: string) => {
  return eventCounts.find((item) => item.status === status)?.count || 0;
};

  const activeEvents = getCountByStatus("In Progress");
  const pendingEvents = getCountByStatus("Pending Approval");
  const completedEvents = getCountByStatus("Completed");
  // const approvedEvents = getCountByStatus("Approved");

 const totalEvents = eventCounts.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div onClick={() => handleCardClick(null)} className="cursor-pointer">
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={Calendar}
          description="All events in the system"
          color="blue"
        />
      </div>

      <div
        onClick={() => handleCardClick("In Progress")}
        className="cursor-pointer"
      >
        <StatCard
          title="In Progress Events"
          value={activeEvents}
          icon={Clock}
          description="Currently running events"
          color="orange"
        />
      </div>

      <div
        onClick={() => handleCardClick("Pending Approval")}
        className="cursor-pointer"
      >
        <StatCard
          title="Pending Events"
          value={pendingEvents}
          icon={Pause}
          description="Events awaiting approval"
          color="yellow"
        />
      </div>

      {/* <div
        onClick={() => handleCardClick("Approved")}
        className="cursor-pointer"
      >
        <StatCard
          title="Approved Events"
          value={approvedEvents}
          icon={LaptopMinimalCheck}
          description="Approved events"
          color="purple"
        />
      </div> */}

      <div
        onClick={() => handleCardClick("Completed")}
        className="cursor-pointer"
      >
        <StatCard
          title="Completed Events"
          value={completedEvents}
          icon={CheckCircle}
          description="Successfully finished events"
          color="green"
        />
      </div>
    </div>
  );
}

export default EventStats;
