import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  // Only admin: both IDs will be empty
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
      // If ISO string
      const parsed = new Date(time);
      if (!isNaN(parsed.getTime())) {
        return format(parsed, "hh:mm a");
      }

      // If plain HH:mm:ss
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
    <div className="p-4 space-y-4 mx-auto">
      <div className="flex justify-between items-center space-x-4 flex-wrap">
        <Button onClick={handlePrevMonth}>Previous</Button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button onClick={handleNextMonth}>Next</Button>
      </div>

      <div className="flex items-center space-x-2 flex-wrap">
        <label htmlFor="month-select" className="font-medium">
          Month:
        </label>
        <select
          id="month-select"
          value={currentDate.getMonth()}
          onChange={(e) => handleGoTo(year, Number(e.target.value) + 1)}
          className="border rounded px-2 py-1"
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
          className="border rounded px-2 py-1"
        >
          {yearRange.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-medium">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startOffset }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}

        {daysInMonth.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = data?.events?.[dateStr] || [];

          return (
            <div
              key={dateStr}
              className="border rounded-md p-2 min-h-[120px] flex flex-col gap-1"
            >
              <div className="text-sm font-semibold">{day.getDate()}</div>
              {dayEvents.map((event) => (
                <Card key={event._id} className="bg-blue-50 text-sm">
                  <CardContent className="p-2">
                    <p className="font-medium">{event.eventName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(event.startTime)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @ {event.proposedLocation}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
