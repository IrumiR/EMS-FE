import { ChevronDown, Download, Users } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useGetUserReport } from "@/api/authApi";
import { toast } from "react-hot-toast";

export default function UserReportCard() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDateDropdown, setOpenDateDropdown] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");

 const { data: userReport, isLoading } = useGetUserReport(
   selectedDateRange === "all"
     ? undefined
     : (selectedDateRange?.replace("-", "_") as
         | "pastDay"
         | "pastWeek"
         | "pastMonth")
 );

  const dateRangeOptions = [
    { value: "pastDay", label: "Past Day" },
    { value: "pastWeek", label: "Past Week" },
    { value: "pastMonth", label: "Past Month" },
  ];

  const getDateRangeDetails = (range: string) => {
    const today = new Date();
    const end = new Date(today.setHours(0, 0, 0, 0));
    let start;

    if (range === "pastDay") {
      start = new Date(end);
      start.setDate(end.getDate() - 1);
    } else if (range === "pastWeek") {
      start = new Date(end);
      start.setDate(end.getDate() - 7);
    } else {
      start = new Date(end);
      start.setDate(end.getDate() - 30);
    }

    const label =
      range === "pastDay"
        ? "Past Day"
        : range === "pastWeek"
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
    setOpenDropdown((prev) => !prev);
  };

  const handleToggleDateDropdown = () => {
    setOpenDateDropdown((prev) => !prev);
  };

  const handleDateRangeSelect = (value: string) => {
    setSelectedDateRange(value);
    setOpenDateDropdown(false);
  };

  const generateUserReportPDF = (users: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Users Report", 14, 20);

    const { label, start, end } = getDateRangeDetails(selectedDateRange);
    const rangeText = `Joined Date Range - ${label} (${formatDate(
      start
    )} - ${formatDate(end)})`;

    doc.setFontSize(12);
    doc.text(rangeText, 14, 28);

    const tableData = users.map((user, index) => [
      index + 1,
      user.userName,
      user.email,
      user.role,
      user.contactNumber || "-",
      user.isActive ? "true" : "false",
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 40,
      head: [
        ["#", "User Name", "Email", "Role", "Contact Number", "Is Active", "Created Date"],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save("users-report.pdf");
  };

  const generateUserReportExcel = (users: any[]) => {
    const { label, start, end } = getDateRangeDetails(selectedDateRange);
    const rangeText = `Joined Date Range - ${label} (${formatDate(
      start
    )} - ${formatDate(end)})`;

    const excelData = users.map((user, index) => ({
      "#": index + 1,
      "User Name": user.userName,
      Email: user.email,
      Role: user.role,
      "Contact Number": user.contactNumber || "-",
      "Is Active": user.isActive ? "true" : "false",
      "Created Date": new Date(user.createdAt).toLocaleDateString(),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [[rangeText]], { origin: "A1" });
    XLSX.utils.sheet_add_json(worksheet, excelData, { origin: "A3" });

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 18 },
      { wch: 12 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Report");
    XLSX.writeFile(workbook, "users-report.xlsx");
  };

  const handleFormatSelect = (format: string) => {
    setOpenDropdown(false);

    if (!userReport || !userReport.users?.length) {
      toast.error("No user report data available");
      return;
    }

    if (format === "PDF") {
      generateUserReportPDF(userReport.users);
    } else if (format === "Excel") {
      generateUserReportExcel(userReport.users);
    }
  };

  const getSelectedDateLabel = () => {
    const option = dateRangeOptions.find(
      (opt) => opt.value === selectedDateRange
    );
    return option ? option.label : "Select Date Range";
  };

  return (
    <div className="bg-green-50 border-green-200 border rounded-lg p-6 transition-all duration-200 hover:shadow-md relative">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-green-600 p-3 rounded-lg bg-white shadow-sm">
            <Users size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Users Summary Report
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Export user data, including names, emails and roles, for easy
              access and management.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-4">
          {/* Date Dropdown */}
          <div className="relative">
            <button
              onClick={handleToggleDateDropdown}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={handleToggleDropdown}
              disabled={!selectedDateRange}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                selectedDateRange
                  ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
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
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleFormatSelect("Excel")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
