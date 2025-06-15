import { ChevronDown, DollarSign, Download } from "lucide-react";
import { useState } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useGetBudgetReport } from "@/api/budgetApi";

export default function BudgetReportCard() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { data: budgetReport } = useGetBudgetReport();

  const handleToggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const generateBudgetReportPDF = (budgets: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Budgets Report", 14, 20);

    const tableData = budgets.map((budget, index) => [
      index + 1,
      budget.eventId?.eventName || "-",
      budget.clientId?.userName || "-",
      budget.createdBy?.userName || "-",
      `Rs. ${budget.totalAmount.toLocaleString()}`,
      new Date(budget.createdAt).toLocaleDateString(),
    ]);

    // Use autoTable as a function, passing doc as first parameter
    autoTable(doc, {
      startY: 30,
      head: [["#", "Event Name", "Client", "Created By", "Total Amount", "Created Date"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [251, 146, 60] }, // Orange color to match the card theme
    });

    doc.save("budgets-report.pdf");
  };

  const generateBudgetReportExcel = (budgets: any[]) => {
    // Prepare data for Excel
    const excelData = budgets.map((budget, index) => ({
      '#': index + 1,
      'Event Name': budget.eventId?.eventName || "-",
      'Client': budget.clientId?.userName || "-",
      'Created By': budget.createdBy?.userName || "-",
      'Total Amount (Rs.)': budget.totalAmount,
      'Created Date': new Date(budget.createdAt).toLocaleDateString(),
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths for better formatting
    const columnWidths = [
      { wch: 5 },  // #
      { wch: 25 }, // Event Name
      { wch: 20 }, // Client
      { wch: 20 }, // Created By
      { wch: 18 }, // Total Amount
      { wch: 15 }, // Created Date
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Budgets Report");
    
    // Generate and download the file
    XLSX.writeFile(workbook, "budgets-report.xlsx");
  };

  const handleFormatSelect = (format: string) => {
    setOpenDropdown(false);
    
    if (!budgetReport || !budgetReport.budgets?.length) {
      alert("No budget report data available");
      return;
    }

    if (format === "PDF") {
      generateBudgetReportPDF(budgetReport.budgets);
    } else if (format === "Excel") {
      generateBudgetReportExcel(budgetReport.budgets);
    }
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
              Budgets Report
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Analyze budget allocations, expenditure tracking and financial projections.
            </p>
          </div>
        </div>

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