import  { useState } from 'react';
import { Calendar, Users, Package, DollarSign, Download, ChevronDown } from 'lucide-react';

function ReportScreen() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleImportClick = (cardId: string) => {
    setOpenDropdown(openDropdown === cardId ? null : cardId);
  };

  const handleFormatSelect = (format: string, cardTitle: string) => {
    setOpenDropdown(null);
  };

  return (
    <div className="p-6 w-full mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-2 text-gray-600">
            Generate and view reports for your events, users, budgets and inventory.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Events Report Card */}
        <div className="bg-blue-50 border-blue-200 border rounded-lg p-6 transition-all duration-200 hover:shadow-md">
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

            <div className="relative ml-4">
              <button
                onClick={() => handleImportClick('events')}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <Download size={16} className="mr-2" />
                Export
                <ChevronDown size={16} className="ml-2" />
              </button>

              {openDropdown === 'events' && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleFormatSelect('PDF', 'Events Report')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleFormatSelect('Excel', 'Events Report')}
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

        {/* Users Report Card */}
        <div className="bg-green-50 border-green-200 border rounded-lg p-6 transition-all duration-200 hover:shadow-md">
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
                onClick={() => handleImportClick('users')}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <Download size={16} className="mr-2" />
                Export
                <ChevronDown size={16} className="ml-2" />
              </button>

              {openDropdown === 'users' && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleFormatSelect('PDF', 'Users Report')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleFormatSelect('Excel', 'Users Report')}
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

        {/* Inventory Items Report Card */}
        <div className="bg-purple-50 border-purple-200 border rounded-lg p-6 transition-all duration-200 hover:shadow-md">
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
                onClick={() => handleImportClick('inventory')}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <Download size={16} className="mr-2" />
                Export
                <ChevronDown size={16} className="ml-2" />
              </button>

              {openDropdown === 'inventory' && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleFormatSelect('PDF', 'Inventory Items Report')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleFormatSelect('Excel', 'Inventory Items Report')}
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

        {/* Budgets Report Card */}
        <div className="bg-orange-50 border-orange-200 border rounded-lg p-6 transition-all duration-200 hover:shadow-md">
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
                onClick={() => handleImportClick('budgets')}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <Download size={16} className="mr-2" />
                Export
                <ChevronDown size={16} className="ml-2" />
              </button>

              {openDropdown === 'budgets' && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleFormatSelect('PDF', 'Budgets Report')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleFormatSelect('Excel', 'Budgets Report')}
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
      </div>

      {/* Click outside to close dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}

export default ReportScreen;