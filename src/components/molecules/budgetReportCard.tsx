import { ChevronDown, DollarSign, Download } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useGetBudgetReport } from "@/api/budgetApi";
import { toast } from "react-hot-toast";

export default function BudgetReportCard() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDateDropdown, setOpenDateDropdown] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");

 const { data: budgetReport } = useGetBudgetReport(
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

    return { label, start, end };
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

  const generateBudgetReportPDF = (budgets: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Budgets Report", 14, 20);

    const { label, start, end } = getDateRangeDetails(selectedDateRange);
    const rangeText = `Created Date Range - ${label} (${formatDate(
      start
    )} - ${formatDate(end)})`;

    doc.setFontSize(12);
    doc.text(rangeText, 14, 28);

    const tableData = budgets.map((budget, index) => [
      index + 1,
      budget.eventId?.eventName || "-",
      budget.clientId?.userName || "-",
      budget.createdBy?.userName || "-",
      `Rs. ${budget.totalAmount.toLocaleString()}`,
      new Date(budget.createdAt).toLocaleDateString(),
      budget.isApproved === true
        ? "Approved"
        : budget.isApproved === false
        ? "Rejected"
        : "Pending",
    ]);

    autoTable(doc, {
      startY: 40,
      head: [
        [
          "#",
          "Event Name",
          "Client",
          "Created By",
          "Total Amount",
          "Created Date",
          "Status",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [251, 146, 60] },
    });

    doc.save("budgets-report.pdf");
  };

  const generateBudgetReportExcel = (budgets: any[]) => {
    const { label, start, end } = getDateRangeDetails(selectedDateRange);
    const rangeText = `Created Date Range - ${label} (${formatDate(
      start
    )} - ${formatDate(end)})`;

    const excelData = budgets.map((budget, index) => ({
      "#": index + 1,
      "Event Name": budget.eventId?.eventName || "-",
      Client: budget.clientId?.userName || "-",
      "Created By": budget.createdBy?.userName || "-",
      "Total Amount (Rs.)": budget.totalAmount,
      "Created Date": new Date(budget.createdAt).toLocaleDateString(),
      Status: budget.isApproved === true
        ? "Approved"
        : budget.isApproved === false
        ? "Rejected"
        : "Pending",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [[rangeText]], { origin: "A1" });
    XLSX.utils.sheet_add_json(worksheet, excelData, { origin: "A3" });

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 15 },
      { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Budgets Report");
    XLSX.writeFile(workbook, "budgets-report.xlsx");
  };

  const handleFormatSelect = (format: string) => {
    setOpenDropdown(false);

    if (!budgetReport || !budgetReport.budgets?.length) {
      toast.error("No budget report data available");
      return;
    }

    if (format === "PDF") {
      generateBudgetReportPDF(budgetReport.budgets);
    } else if (format === "Excel") {
      generateBudgetReportExcel(budgetReport.budgets);
    }
  };

  const getSelectedDateLabel = () => {
    const option = dateRangeOptions.find(
      (opt) => opt.value === selectedDateRange
    );
    return option ? option.label : "Select Date Range";
  };

  return (
    <div className="bg-orange-50 border-orange-200 border rounded-lg p-6 transition-all duration-200 hover:shadow-md relative">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-orange-600 p-3 rounded-lg bg-white shadow-sm">
            <DollarSign size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Budget Summary Report
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Analyze budget allocations, expenditure tracking and financial
              projections.
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
              <ChevronDown size={16} className="ml-2" />
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
