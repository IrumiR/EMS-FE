import { Calendar, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { eventTypeImages } from "./eventDetailsStep";

function EventCard({ 
  image,
  category,
  status,
  date,
  startTime,
  title,
  proposedLocation,
  progress
}: {
  image: string;
  category: string;
  status: string;
  date: string;
  startTime: string;
  title: string;
  proposedLocation: string;
  progress: number;
}) {

  const defaultImage = eventTypeImages.others;

  return (
    <Card className="overflow-hidden h-full">
      {/* Card Image with Category Badge and Status */}
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
          <Badge className="bg-pink-500 hover:bg-pink-600 text-xs">
            {status}
          </Badge>
        </div>
      </div>

      {/* Event Date and Time */}
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{date}
           {startTime && ` — ${startTime}`}</span>
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
        <Progress value={progress} className="h-1 mb-1 [&>div]:bg-emerald-500" />
          <div className="flex justify-start items-center text-xs">
            <span className="text-gray-500">{progress}%</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

interface Event {
  image: string;
  category: string;
  status: string;
  date: string;
  startTime: string;
  title: string;
  proposedLocation: string;
  progress: number;
}

export default function EventCardGrid({ events = [] }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {events.map((event, index) => (
        <EventCard key={index} {...event} />
      ))}
    </div>
  );
}