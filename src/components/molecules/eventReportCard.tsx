import { useState } from 'react';
import { Calendar, Download, ChevronDown } from 'lucide-react';
import { useGetEventReport } from '@/api/eventApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function EventReportCard() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { data: eventReport } = useGetEventReport();

  const handleToggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const generateEventReportPDF = (events: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Events Report", 14, 20);

    const tableData = events.map((event, index) => [
      index + 1,
      event.eventName,
      event.eventType?.join(", "),
      new Date(event.startDate).toLocaleDateString(),
      new Date(event.endDate).toLocaleDateString(),
      event.proposedLocation || "-",
      event.clientId?.userName || "-",
    ]);

    // Use autoTable as a function, passing doc as first parameter
    autoTable(doc, {
      startY: 30,
      head: [["#", "Event Name", "Event Type", "Start Date", "End Date", "Location", "Client"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("events-report.pdf");
  };

  const generateEventReportExcel = (events: any[]) => {
    // Prepare data for Excel
    const excelData = events.map((event, index) => ({
      '#': index + 1,
      'Event Name': event.eventName,
      'Event Type': event.eventType?.join(", ") || "-",
      'Start Date': new Date(event.startDate).toLocaleDateString(),
      'End Date': new Date(event.endDate).toLocaleDateString(),
      'Location': event.proposedLocation || "-",
      'Client': event.clientId?.userName || "-",
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths for better formatting
    const columnWidths = [
      { wch: 5 },  // #
      { wch: 25 }, // Event Name
      { wch: 20 }, // Event Type
      { wch: 12 }, // Start Date
      { wch: 12 }, // End Date
      { wch: 20 }, // Location
      { wch: 15 }, // Client
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events Report");
    
    // Generate and download the file
    XLSX.writeFile(workbook, "events-report.xlsx");
  };

  const handleFormatSelect = (format: string) => {
    setOpenDropdown(false);
    
    if (!eventReport || !eventReport.events?.length) {
      alert("No event report data available");
      return;
    }

    if (format === "PDF") {
      generateEventReportPDF(eventReport.events);
    } else if (format === "Excel") {
      generateEventReportExcel(eventReport.events);
    }
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
              Events Report
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Generate comprehensive reports for all your events to help you make informed decisions.
            </p>
          </div>
        </div>

        {/* Export Dropdown */}
        <div className="relative ml-4">
          <button
            onClick={handleToggleDropdown}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          >
            <Download size={16} className="mr-2" />
            Export
            <ChevronDown size={16} className="ml-2" />
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => handleFormatSelect('PDF')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleFormatSelect('Excel')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  Export as Excel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(false)}
        />
      )}
    </div>
  );
}