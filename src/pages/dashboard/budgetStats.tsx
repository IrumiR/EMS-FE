import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckSquare, XCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useGetBudgetCountsByStatus } from "@/api/dashboardApi";
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

function BudgetStats() {
  const { data, isLoading, error } = useGetBudgetCountsByStatus();

  const getCount = (status: string) =>
    data?.data.find((item) => item.status === status)?.count ?? 0;

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row justify-between pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Pending Budget"
          value="Error"
          icon={DollarSign}
          description="Awaiting approval"
          color="yellow"
        />
        <StatCard
          title="Approved Budget"
          value="Error"
          icon={CheckSquare}
          description="Approved and allocated"
          color="green"
        />
        <StatCard
          title="Rejected Budget"
          value="Error"
          icon={XCircle}
          description="Rejected requests"
          color="red"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        className="cursor-pointer"
        onClick={() => navigate("/budget?status=Pending")}
      >
        <StatCard
          title="Pending Budget"
          value={getCount("Pending")}
          icon={DollarSign}
          description="Awaiting approval"
          color="yellow"
        />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => navigate("/budget?status=Approved")}
      >
        <StatCard
          title="Approved Budget"
          value={getCount("Approved")}
          icon={CheckSquare}
          description="Approved and allocated"
          color="green"
        />
      </div>

      <div
        className="cursor-pointer"
        onClick={() => navigate("/budget?status=Rejected")}
      >
        <StatCard
          title="Rejected Budget"
          value={getCount("Rejected")}
          icon={XCircle}
          description="Rejected requests"
          color="red"
        />
      </div>
    </div>
  );
}

export default BudgetStats;
