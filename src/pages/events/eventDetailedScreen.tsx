import { useGetEventById } from "@/api/eventApi";
import { Calendar, Clock, MapPin, Tag, Info, CheckCircle, User, Package, Loader } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from "react-router-dom";

function EventDetailedScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data, isLoading, error } = useGetEventById(eventId ?? null);
  const event = data?.event;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return date.toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending approval":
        return "bg-pink-100 text-pink-800";
      case "in progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-teal-100 text-teal-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "hold":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="text-red-700">Failed to load event details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{event?.eventName}</h1>
          <div className="mt-2 flex items-center">
            <Badge className={getStatusColor(event?.status)}>
              {event?.status || "Status Unknown"}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 md:mt-0">
          Created on {formatDate(event?.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info size={16} /> Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-3">
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Tag size={14} className="mr-1" /> Type
              </div>
              <div className="flex flex-wrap gap-1">
                {event?.eventType?.map((type: string, index: number) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {type}
                  </Badge>
                )) || "No type specified"}
              </div>
            </div>

            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Info size={14} className="mr-1" /> Description
              </div>
              <p className="text-gray-800 text-sm">
                {event?.eventDescription || "No description provided"}
              </p>
            </div>

            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <MapPin size={14} className="mr-1" /> Location
              </div>
              <p className="text-gray-800 text-sm">
                {event?.proposedLocation || "No location specified"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar size={16} /> Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-3">
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar size={14} className="mr-1" /> Start Date
              </div>
              <p className="text-gray-800 text-sm">{formatDate(event?.startDate)}</p>
            </div>

            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar size={14} className="mr-1" /> End Date
              </div>
              <p className="text-gray-800 text-sm">{formatDate(event?.endDate)}</p>
            </div>

            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Clock size={14} className="mr-1" /> Time
              </div>
              <p className="text-gray-800 text-sm">
                {event?.startTime && event?.endTime
                  ? `${event.startTime} - ${event.endTime}`
                  : "No specific time set"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={16} /> People
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-3">
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <User size={14} className="mr-1" /> Client
              </div>
              <p className="text-gray-800 text-sm truncate">{event?.clientId?.userName || "None"}</p>
            </div>

            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <CheckCircle size={14} className="mr-1" /> Assignees
              </div>
              <div className="flex flex-wrap gap-1">
                {event?.assignees?.length > 0 ? (
                  event.assignees.map((assignee: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {assignee}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">None</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <User size={14} className="mr-1" /> Created By
              </div>
              <p className="text-gray-800 text-sm truncate">{event?.createdBy?.userName || "Unknown"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package size={16} /> Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-3">
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Package size={14} className="mr-1" /> Inventory ({event?.inventoryItems?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {event?.inventoryItems?.length > 0 ? (
                  event.inventoryItems.map((item: { itemName: string }, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item.itemName}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">None</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <CheckCircle size={14} className="mr-1" /> Tasks ({event?.tasks?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {event?.tasks?.length > 0 ? (
                  event.tasks.map((task: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {task}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">None</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EventDetailedScreen;