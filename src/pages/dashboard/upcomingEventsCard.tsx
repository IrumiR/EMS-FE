import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock } from 'lucide-react';

const UpcomingEventsCard = ({ events = [] }) => {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending approval':
        return 'secondary';
      case 'in progress':
        return 'default';
      case 'hold':
        return 'destructive';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending approval':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'hold':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Sample event structure for demonstration (remove when binding real data)
  const sampleEvent = {
    id: 1,
    eventName: "Company Annual Conference",
    startDate: "2024-11-15",
    endDate: "2024-11-17",
    progress: 65,
    status: "In Progress"
  };

  const displayEvents = events.length > 0 ? events : [sampleEvent];

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Events
        </CardTitle>
        <p className="text-sm text-gray-500">An overview of your recent and upcoming events</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayEvents.map((event, index) => (
          <Card key={event.id || index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Event Name and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {event.eventName || 'Event Name'}
                  </h3>
                  <Badge 
                    variant={getStatusVariant(event.status)}
                    className={`${getStatusColor(event.status)} shrink-0 w-fit`}
                  >
                    {event.status || 'Pending'}
                  </Badge>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="text-sm">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {event.progress || 0}%
                    </span>
                  </div>
                  <Progress 
                    value={event.progress || 0} 
                    className="h-2 bg-teal-100 [&>div]:bg-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {events.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No upcoming events found</p>
            <p className="text-xs mt-1">Events will appear here once you add them</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsCard;