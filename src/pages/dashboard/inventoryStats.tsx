import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Building, ExternalLink } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useGetInventoryItemCount } from "@/api/dashboardApi"; 

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

function InventoryStats() {
  const { data, isLoading, error } = useGetInventoryItemCount();

  const counts = data?.data ?? {
    totalCount: 0,
    internalCount: 0,
    externalCount: 0,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Items"
          value="Error"
          icon={Package}
          description="Failed to load data"
          color="red"
        />
        <StatCard
          title="Internal Items"
          value="Error"
          icon={Building}
          description="Failed to load data"
          color="red"
        />
        <StatCard
          title="External Items"
          value="Error"
          icon={ExternalLink}
          description="Failed to load data"
          color="red"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total Items"
        value={counts.totalCount}
        icon={Package}
        description="All inventory items"
        color="blue"
      />
      <StatCard
        title="Internal Items"
        value={counts.internalCount}
        icon={Building}
        description="Company-owned items"
        color="indigo"
      />
      <StatCard
        title="External Items"
        value={counts.externalCount}
        icon={ExternalLink}
        description="Rented or borrowed items"
        color="purple"
      />
    </div>
  );
}

export default InventoryStats;
