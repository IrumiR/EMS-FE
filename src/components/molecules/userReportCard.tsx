import { ChevronDown, Download, Users } from "lucide-react";
import { useState } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useGetUserReport } from "@/api/authApi";

export default function UserReportCard() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { data: userReport } = useGetUserReport();

  const handleToggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const generateUserReportPDF = (users: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Users Report", 14, 20);

    const tableData = users.map((user, index) => [
      index + 1,
      user.userName,
      user.email,
      user.role,
      user.contactNumber || "-",
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    // Use autoTable as a function, passing doc as first parameter
    autoTable(doc, {
      startY: 30,
      head: [["#", "User Name", "Email", "Role", "Contact Number", "Created Date"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] }, // Green color to match the card theme
    });

    doc.save("users-report.pdf");
  };

  const handleFormatSelect = (format: string) => {
    setOpenDropdown(false);
    if (format === "PDF") {
      if (!userReport || !userReport.users?.length) {
        alert("No user report data available");
        return;
      }
      generateUserReportPDF(userReport.users);
    }
    // Future: Add Excel export
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
              Users Report
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Export user data, including names, emails and roles, for easy access and management.
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