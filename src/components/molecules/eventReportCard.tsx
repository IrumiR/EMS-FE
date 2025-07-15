import { useState } from "react";
import { Calendar, Download, ChevronDown } from "lucide-react";
import { useGetEventReport } from "@/api/eventApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";

export default function EventReportCard() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [openDateDropdown, setOpenDateDropdown] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const { data: eventReport, isLoading } = useGetEventReport(
    selectedDateRange === "all"
      ? undefined
      : (selectedDateRange?.replace("-", "_") as
          | "past_day"
          | "past_week"
          | "past_month")
  );


  const dateRangeOptions = [
    { value: "past-day", label: "Past Day" },
    { value: "past-week", label: "Past Week" },
    { value: "past-month", label: "Past Month" },
    // { value: "all", label: "All" },
  ];

  const getDateRangeDetails = (range: string) => {
    const today = new Date();
    const end = new Date(today.setHours(0, 0, 0, 0));
    let start;

    if (range === "past-day") {
      start = new Date(end);
      start.setDate(end.getDate() - 1);
    } else if (range === "past-week") {
      start = new Date(end);
      start.setDate(end.getDate() - 7);
    } else {
      start = new Date(end);
      start.setDate(end.getDate() - 30);
    }

    const label =
      range === "past-day"
        ? "Past Day"
        : range === "past-week"
        ? "Past Week"
        : "Past Month";

    return {
      label,
      start,
      end,
    };
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleToggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleToggleDateDropdown = () => {
    setOpenDateDropdown(!openDateDropdown);
  };

  const handleDateRangeSelect = (value: string) => {
    setSelectedDateRange(value);
    setOpenDateDropdown(false);
  };

  const generateEventReportPDF = (events: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Events Report", 14, 20);

    const { label, start, end } = getDateRangeDetails(selectedDateRange);
    const rangeText = `Date Range - ${label} (${formatDate(
      start
    )} - ${formatDate(end)})`;

    doc.setFontSize(12);
    doc.text(rangeText, 14, 28);

    const tableData = events.map((event, index) => [
      index + 1,
      event.eventName,
      event.eventType?.join(", "),
      new Date(event.startDate).toLocaleDateString(),
      new Date(event.endDate).toLocaleDateString(),
      event.proposedLocation || "-",
      event.clientId?.userName || "-",
    ]);

    autoTable(doc, {
      startY: 40,
      head: [
        [
          "#",
          "Event Name",
          "Event Type",
          "Start Date",
          "End Date",
          "Location",
          "Client",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("events-report.pdf");
  };

  const generateEventReportExcel = (events: any[]) => {
    const { label, start, end } = getDateRangeDetails(selectedDateRange);
    const rangeText = `Date Range - ${label} (${formatDate(
      start
    )} - ${formatDate(end)})`;

    const excelData = events.map((event, index) => ({
      "#": index + 1,
      "Event Name": event.eventName,
      "Event Type": event.eventType?.join(", ") || "-",
      "Start Date": new Date(event.startDate).toLocaleDateString(),
      "End Date": new Date(event.endDate).toLocaleDateString(),
      Location: event.proposedLocation || "-",
      Client: event.clientId?.userName || "-",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [[rangeText]], { origin: "A1" });
    XLSX.utils.sheet_add_json(worksheet, excelData, { origin: "A3" });
    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Events Report");
    XLSX.writeFile(workbook, "events-report.xlsx");
  };

  const handleFormatSelect = (format: string) => {
    setOpenDropdown(false);

    if (!eventReport || !eventReport.events?.length) {
      toast.error("No event report data available");
      return;
    }

    if (format === "PDF") {
      generateEventReportPDF(eventReport.events);
    } else if (format === "Excel") {
      generateEventReportExcel(eventReport.events);
    }
  };

  const getSelectedDateLabel = () => {
    const option = dateRangeOptions.find(
      (opt) => opt.value === selectedDateRange
    );
    return option ? option.label : "Select Date Range";
  };

  return (
    <div className="bg-blue-50 border-blue-200 border rounded-lg p-6 transition-all duration-200 hover:shadow-md relative">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-blue-600 p-3 rounded-lg bg-white shadow-sm">
            <Calendar size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Events Summary Report
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Generate comprehensive reports for all your events to help you
              make informed decisions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-4">
          <div className="relative">
            <button
              onClick={handleToggleDateDropdown}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 min-w-0"
            >
              <span className="truncate max-w-28 sm:max-w-none">
                {getSelectedDateLabel()}
              </span>
              <ChevronDown size={16} className="ml-2 flex-shrink-0" />
            </button>

            {openDateDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  {dateRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDateRangeSelect(option.value)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={handleToggleDropdown}
              disabled={!selectedDateRange}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                selectedDateRange
                  ? "bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Download size={16} className="mr-2" />
              Export
              <ChevronDown size={16} className="ml-2" />
            </button>

            {openDropdown && selectedDateRange && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleFormatSelect("PDF")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleFormatSelect("Excel")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(openDropdown || openDateDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setOpenDropdown(false);
            setOpenDateDropdown(false);
          }}
        />
      )}
    </div>
  );
}
