import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, Pencil, MessageCircle, MessageCircleHeart, ArrowUp, MoveDown } from "lucide-react";

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
}

export default function TaskCard({ task }: { task: Task }) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-orange-500 bg-orange-50';
      case 'low':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <ArrowUp className="w-3 h-3" />;
      case 'medium':
        return <ArrowUp className="w-3 h-3" />;
      case 'low':
        return <MoveDown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'NA') return 'NA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full max-w-sm bg-white shadow-sm border border-gray-200 rounded-lg">
      <CardContent className="p-4 pt-2">
        {/* Priority and Status Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
            </div>
            <span className={`text-sm font-medium ${getPriorityColor(task.priority).split(' ')[0]}`}>
              {task.priority}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        {/* Task Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
          {task.taskName}
        </h3>

        {/* Task Description */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {task.taskDescription}
        </p>

        {/* Due Date */}
        <div className="text-right">
          <span className="text-xs text-gray-500">Due Date: </span>
          <span className="text-xs font-medium text-gray-700">
            {formatDate(task.endDate)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-2 py-0 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MessageCircle className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MessageCircleHeart className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
