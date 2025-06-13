import { ChevronDown, Download, Package } from "lucide-react";
import { useState } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useGetInventoryReport } from "@/api/inventoryApi";

export default function InventoryReportCard() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { data: inventoryReport } = useGetInventoryReport();

  const handleToggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const generateInventoryReportPDF = (items: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Inventory Items Report", 14, 20);

    const tableData = items.map((item, index) => [
      index + 1,
      item.itemName,
      item.category,
      item.totalQuantity,
      item.condition,
      item.isExternal ? "External" : "Internal",
      `Rs. ${item.price.toLocaleString()}`,
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    // Use autoTable as a function, passing doc as first parameter
    autoTable(doc, {
      startY: 30,
      head: [["#", "Item Name", "Category", "Quantity", "Condition", "Type", "Price", "Created Date"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [147, 51, 234] }, // Purple color to match the card theme
    });

    doc.save("inventory-items-report.pdf");
  };

  const handleFormatSelect = (format: string) => {
    setOpenDropdown(false);
    if (format === "PDF") {
      if (!inventoryReport || !inventoryReport.items?.length) {
        alert("No inventory report data available");
        return;
      }
      generateInventoryReportPDF(inventoryReport.items);
    }
    // Future: Add Excel export
  };

  return (
    <div className="bg-purple-50 border-purple-200 border rounded-lg p-6 transition-all duration-200 hover:shadow-md relative">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-purple-600 p-3 rounded-lg bg-white shadow-sm">
            <Package size={24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Inventory Items Report
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Track inventory levels, view stock movements, and generate procurement reports.
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