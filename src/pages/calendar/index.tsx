import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { useGetAllEventByMonth } from "@/api/eventApi";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const yearRange = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const userId = localStorage.getItem("userId") || "";
  const role = localStorage.getItem("role");

  let queryUserId = "";
  let queryClientId = "";

  if (role === "client") {
    queryClientId = userId;
  } else if (role !== "admin") {
    queryUserId = userId;
  }


  const { data, isLoading, isError } = useGetAllEventByMonth(
    year,
    month,
    queryUserId,
    queryClientId
  );

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startOffset = getDay(startOfMonth(currentDate));

  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleGoTo = (yearSelected: number, monthSelected: number) => {
    setCurrentDate(new Date(yearSelected, monthSelected - 1));
  };

  const formatTime = (time: string) => {
    try {
      const parsed = new Date(time);
      if (!isNaN(parsed.getTime())) {
        return format(parsed, "hh:mm a");
      }

      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number(hours), Number(minutes));
      return format(date, "hh:mm a");
    } catch {
      return time;
    }
  };

  if (isLoading) return <div className="p-4">Loading events...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading events.</div>;

  return (
    <div className="p-2 md:p-4 space-y-2 md:space-y-4 mx-auto max-w-full overflow-hidden">
      <div className="flex justify-between items-center space-x-2 md:space-x-4 flex-wrap">
        <Button
          onClick={handlePrevMonth}
          className="bg-green-600 text-xs md:text-sm px-2 md:px-4"
        >
          Previous
        </Button>
        <h2 className="text-lg md:text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button
          onClick={handleNextMonth}
          className="bg-green-600 text-xs md:text-sm px-2 md:px-4"
        >
          Next
        </Button>
      </div>

      <div className="flex items-center space-x-1 md:space-x-2 flex-wrap text-sm md:text-base">
        <label htmlFor="month-select" className="font-medium">
          Month:
        </label>
        <select
          id="month-select"
          value={currentDate.getMonth()}
          onChange={(e) => handleGoTo(year, Number(e.target.value) + 1)}
          className="border rounded px-1 md:px-2 py-1 text-xs md:text-sm"
        >
          {monthNames.map((name, idx) => (
            <option key={name} value={idx}>
              {name}
            </option>
          ))}
        </select>

        <label htmlFor="year-select" className="font-medium">
          Year:
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => handleGoTo(Number(e.target.value), month)}
          className="border rounded px-1 md:px-2 py-1 text-xs md:text-sm"
        >
          {yearRange.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center font-medium text-xs md:text-sm">
        {weekdays.map((day) => (
          <div key={day} className="p-1 md:p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {Array.from({ length: startOffset }).map((_, index) => (
          <div key={`empty-${index}`} className="p-1 md:p-2" />
        ))}

        {daysInMonth.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = data?.events?.[dateStr] || [];

          return (
            <div key={dateStr}>
              {/* Mobile view with hover card */}
              <div className="md:hidden">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="border rounded-md p-1 min-h-[80px] flex flex-col gap-1 overflow-hidden cursor-pointer hover:bg-gray-50">
                      <div className="text-xs font-semibold">
                        {day.getDate()}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="text-xs text-blue-600 font-medium">
                          {dayEvents.length} event
                          {dayEvents.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </HoverCardTrigger>
                  {dayEvents.length > 0 && (
                    <HoverCardContent className="w-80 p-3">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">
                          {format(day, "MMMM d, yyyy")}
                        </h4>
                        <div className="space-y-3">
                          {dayEvents.map((event) => (
                            <div
                              key={event._id}
                              className="border-l-2 border-blue-500 pl-3 py-1"
                            >
                              <p className="font-medium text-sm text-gray-900">
                                {event.eventName}
                              </p>
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Time:</span>{" "}
                                {formatTime(event.startTime)}
                              </p>
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Location:</span>{" "}
                                {event.proposedLocation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </HoverCardContent>
                  )}
                </HoverCard>
              </div>

              {/* Desktop view with full event details */}
              <div className="hidden md:block">
                <div className="border rounded-md p-2 min-h-[120px] flex flex-col gap-1 overflow-hidden">
                  <div className="text-sm font-semibold">{day.getDate()}</div>
                  {dayEvents.map((event) => (
                    <Card key={event._id} className="bg-blue-50 text-xs">
                      <CardContent className="p-2">
                        <p className="font-medium text-xs leading-tight truncate">
                          {event.eventName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(event.startTime)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @ {event.proposedLocation}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
