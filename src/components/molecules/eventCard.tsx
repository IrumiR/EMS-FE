import { Calendar, MapPin, Eye, Pencil, ListTodo } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { eventTypeImages } from "./eventDetailsStep";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ApproveEventDialog from "./approveEvent";
import ViewEventDialog from "./viewEvent";
import UpdateEventDialog from "../organisms/updateEventDialog";
import { useState } from "react";
import StatusSelect from "./updateEventStatus";

const getStatusColor = (status: string) => {
  switch(status) {
    case "Approved":
      return "bg-green-500 hover:bg-green-600";
    case "Pending Approval":
      return "bg-pink-500 hover:bg-pink-600";
    case "In Progress":
      return "bg-blue-500 hover:bg-blue-600";
    case "Hold":
      return "bg-red-500 hover:bg-red-600";
    case "Completed":
      return "bg-purple-500 hover:bg-purple-600";
    case "Cancelled":
      return "bg-amber-700 hover:bg-amber-800"; 
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

function EventCard({
  id,
  image,
  category,
  status,
  date,
  startTime,
  title,
  proposedLocation,
  progress,
  onApprove,
  isAdmin = false,
}: {
  id: string;
  image: string;
  category: string;
  status: string;
  date: string;
  startTime: string;
  title: string;
  proposedLocation: string;
  progress: number;
  onApprove?: (id: string) => void;
  isAdmin?: boolean;
}) {
  const navigate = useNavigate();
  const userType = localStorage.getItem("role");
  const defaultImage = eventTypeImages.others;

  const handleView = () => {
    navigate(`/events/${id}`);
  };

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTimeState, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApprove) {
      onApprove(id);
    }
  };

  return (
    <Card className="overflow-hidden h-full p-2">
      <div className="relative">
        <img
          src={image || defaultImage}
          alt={title}
          className="w-full h-36 object-contain object-center"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-white/90 text-xs font-medium">
            {category}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge
            className={`text-xs text-white ${getStatusColor(status)}`}
          >
            {status}
          </Badge>
        </div>
      </div>

      {/* Event Date and Time */}
      <CardContent className="p-2 space-y-2">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {date}
            {startTime && ` — ${startTime}`}
          </span>
        </div>

        <h3 className="font-medium text-base line-clamp-2">{title}</h3>

        {/* Location */}
        <div className="flex items-center text-xs text-gray-500">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{proposedLocation}</span>
        </div>
      </CardContent>

      {/* Progress Bar */}
      <CardFooter className="p-3 pt-0">
        <div className="w-full">
          <Progress
            value={progress}
            className="h-1 mb-1 [&>div]:bg-emerald-500"
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{progress}%</span>
            <div className="flex space-x-2">
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8"
              >
                <ListTodo className="h-4 w-4 text-green-600 hover:text-green-700 hover:bg-green-50" />
              </Button>

              <Button
                onClick={() => setIsViewDialogOpen(true)}
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8"
              >
                <Eye className="h-4 w-4 text-green-600 hover:text-green-700 hover:bg-green-50" />
              </Button>

              <Button
                onClick={() => setIsEditDialogOpen(true)}
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8"
              >
                <Pencil className="h-4 w-4 text-green-600 hover:text-green-700 hover:bg-green-50" />
              </Button>
            </div>
          </div>
          {status === "Pending Approval" &&
            (userType === "admin" || userType === "manager") && (
              <ApproveEventDialog
                title={title}
                eventId={id}
                onApprove={() => onApprove?.(id)}
              />
            )}

             {status !== "Pending Approval" && (
            <div className="mt-4">
              <StatusSelect eventId={id} status={status} />
            </div>
          )}

          <ViewEventDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            eventId={id}
            title={title}
          />

          <UpdateEventDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            eventId={id}
            title={title}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            startTime={startTimeState}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

interface Event {
  id: string;
  image: string;
  category: string;
  status: string;
  date: string;
  startTime: string;
  title: string;
  proposedLocation: string;
  progress: number;
}

export default function EventCardGrid({
  events = [],
  onApproveEvent,
  isAdmin = false,
}: {
  events: Event[];
  onApproveEvent?: (id: string) => void;
  isAdmin?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {events.map((event) => (
        <EventCard
          key={event.id}
          {...event}
          onApprove={onApproveEvent}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
