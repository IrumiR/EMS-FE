import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DollarSign,
    CheckSquare,
    XCircle,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

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


function BudgetStats(){
  
    return(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Pending Budget"
              value="$0"
              icon={DollarSign}
              description="Awaiting approval"
              color="yellow"
            />
            <StatCard
              title="Approved Budget"
              value="$0"
              icon={CheckSquare}
              description="Approved and allocated"
              color="green"
            />
            <StatCard
              title="Rejected Budget"
              value="$0"
              icon={XCircle}
              description="Rejected requests"
              color="red"
            />
          </div>
    )
};

export default BudgetStats;