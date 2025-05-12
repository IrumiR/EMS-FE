import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiSearch } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Funnel, ChevronDown } from "lucide-react";
import { AddEventDialog } from "@/components/organisms/addEventDialog";
import EventCardGrid from "@/components/molecules/eventCard";
import { useEffect, useState } from "react";
import { useGetAllEvents } from "@/api/eventApi";
import { eventTypeImages } from "@/components/molecules/eventDetailsStep";

function EventsScreen() {
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


  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [eventTypeFilter, setEventTypeFilter] = useState("All Event Types");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const data = useGetAllEvents();
  const eventsData = data?.data?.events || [];
  
  const getEventImage = (eventType: any) => {
    let eventTypeKey: keyof typeof eventTypeImages = "others"; 
    
    if (Array.isArray(eventType) && eventType.length > 0) {
      const type = eventType[0].toLowerCase();
      if (Object.keys(eventTypeImages).includes(type)) {
        eventTypeKey = type as keyof typeof eventTypeImages;
      }
    }
    
    return eventTypeImages[eventTypeKey];
  };
  
 
  useEffect(() => {
    if (eventsData.length > 0) {
      const formattedEvents = eventsData.map(event => ({
        image: getEventImage(event.eventType),
        category: event.eventType.join(", "),
        status: Array.isArray(event.status) ? event.status.join(", ") : event.status || "",
        date: event.startDate ? new Date(event.startDate).toLocaleDateString() : "",
        startTime: event.startTime ? new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        title: event.eventName || "",
        proposedLocation: event.proposedLocation || "",
        progress: event.progress || 0,
      }));
      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    }
  }, [eventsData]);

  useEffect(() => {
    let results = events;
    
    if (searchTerm) {
      results = results.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.proposedLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "All Statuses") {
      results = results.filter(event => event.status.includes(statusFilter));
    }
  
    if (eventTypeFilter !== "All Event Types") {
      results = results.filter(event => event.category.includes(eventTypeFilter));
    }
    
    setFilteredEvents(results);
    setCurrentPage(1); 
  }, [searchTerm, statusFilter, eventTypeFilter, events]);


  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); 
  };

  // Status options
  const statusOptions = [
    "All Statuses",
    "Pending Approval",
    "Approved",
    "In Progress",
    "Hold",
    "Completed",
    "Canceled"
  ];

  // Event type options
  const eventTypeOptions = [
    "All Event Types",
    "wedding",
    "birthday",
    "concert",
    "conference",
    "sports",
    "charity",
    "corporate",
    "others"
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="mt-4 text-gray-600">
            Manage and track your events here.
          </p>
        </div>

        <div>
          <AddEventDialog />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative w-2/3 flex justify-start">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input 
            placeholder="Search events..." 
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                <Funnel className="mr-2 h-4 w-4" />
                {statusFilter}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map((status) => (
                <DropdownMenuItem 
                  key={status} 
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                {eventTypeFilter}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {eventTypeOptions.map((type) => (
                <DropdownMenuItem 
                  key={type} 
                  onClick={() => setEventTypeFilter(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-8">
        {paginatedEvents && paginatedEvents.length > 0 ? (
          <div className="flex flex-wrap items-start justify-start">
            <EventCardGrid events={paginatedEvents} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 text-lg">No events found.</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {filteredEvents.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Events per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="px-2 py-1 border border-gray-300 rounded"
              >
                {[6, 12, 24].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsScreen;