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
import { useEffect, useState, useMemo } from "react";
import { useGetAllEvents } from "@/api/eventApi";
import { eventTypeImages } from "@/components/molecules/eventDetailsStep";
import { useSearchParams } from "react-router-dom";


function EventsScreen() {
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

  const [events, setEvents] = useState<Event[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const statusFromUrl = searchParams.get("status");
    if (statusFromUrl && statusOptions.includes(statusFromUrl)) {
      setStatusFilter(statusFromUrl);
    }
  }, [searchParams]);


  const hasActiveFilters = statusFilter !== "" || eventTypeFilter !== "";

 
  const fetchCurrentPage = hasActiveFilters ? 1 : currentPage;
  const fetchRowsPerPage = hasActiveFilters ? 100 : rowsPerPage; 

  const data = useGetAllEvents(
    fetchCurrentPage,
    fetchRowsPerPage,
    searchTerm
  );

  const eventsData = data?.data?.events || [];
  const pagination = data?.data?.pagination;
  const userType = localStorage.getItem("role");

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
      const formattedEvents = eventsData.map((event) => ({
        id: event._id || String(Math.random()),
        image: getEventImage(event.eventType),
        category: event.eventType.join(", "),
        status: Array.isArray(event.status)
          ? event.status.join(", ")
          : event.status || "",
        date: event.startDate
          ? new Date(event.startDate).toLocaleDateString()
          : "",
        startTime: event.startTime ?? "",
        title: event.eventName || "",
        proposedLocation: event.proposedLocation || "",
        progress: event.progress || 0,
      }));
      setEvents(formattedEvents);
    } else if (!data?.isLoading) {
      setEvents([]);
    }
  }, [eventsData, data?.isLoading]);


  const paginationTotal = pagination?.total || 0;
  const paginationTotalPages = pagination?.totalPages || 1;


  const { filteredEvents, totalFilteredEvents, totalPages } = useMemo(() => {
    let filtered = [...events];

    if (statusFilter) {
      filtered = filtered.filter((event) =>
        event.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    if (eventTypeFilter) {
      filtered = filtered.filter((event) =>
        event.category.toLowerCase().includes(eventTypeFilter.toLowerCase())
      );
    }

    const totalFiltered = filtered.length;

    if (hasActiveFilters) {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      filtered = filtered.slice(startIndex, endIndex);

      const calculatedTotalPages = Math.ceil(totalFiltered / rowsPerPage);

      return {
        filteredEvents: filtered,
        totalFilteredEvents: totalFiltered,
        totalPages: calculatedTotalPages,
      };
    }

  
    return {
      filteredEvents: filtered,
      totalFilteredEvents: paginationTotal,
      totalPages: paginationTotalPages,
    };
  }, [
    events,
    statusFilter,
    eventTypeFilter,
    currentPage,
    rowsPerPage,
    hasActiveFilters,
    paginationTotal,
    paginationTotalPages,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = Number(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); 
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };
  
  const handleEventTypeFilterChange = (eventType: string) => {
    setEventTypeFilter(eventType);
    setCurrentPage(1); 
  };

  const statusOptions = [
    "",
    "Pending Approval",
    "Approved",
    "In Progress",
    "Hold",
    "Completed",
    "Canceled",
  ];

  const eventTypeOptions = [
    "",
    "wedding",
    "birthday",
    "concert",
    "conference",
    "sports",
    "charity",
    "corporate",
    "others",
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
          {(userType === "admin" || userType === "manager") && (
            <AddEventDialog />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative w-2/3 flex justify-start">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search events..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                <Funnel className="mr-2 h-4 w-4" />
                {statusFilter || "All Status"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusFilterChange(status)}
                >
                  {status || "All Status"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                {eventTypeFilter || "All Types"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {eventTypeOptions.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => handleEventTypeFilterChange(type)}
                >
                  {type || "All Types"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-8">
        {filteredEvents && filteredEvents.length > 0 ? (
          <div className="flex flex-wrap items-start justify-start">
            <EventCardGrid events={filteredEvents} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 text-lg">
              {data?.isLoading ? "Loading events..." : "No events found."}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalFilteredEvents > 0 && (
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || data?.isLoading}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || data?.isLoading}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {filteredEvents.length} of {totalFilteredEvents} events
              </span>
              <span className="text-sm text-gray-700">Events per page:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                disabled={data?.isLoading}
                className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                {[5, 10, 15, 20].map((option) => (
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
