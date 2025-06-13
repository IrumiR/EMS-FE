import EventReportCard from '@/components/molecules/eventReportCard';
import UserReportCard from '@/components/molecules/userReportCard';
import BudgetReportCard from '@/components/molecules/budgetReportCard';
import InventoryReportCard from '@/components/molecules/inventoryReportCard';

function ReportScreen() {

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
        <EventReportCard />

        {/* Users Report Card */}
        <UserReportCard />

        {/* Inventory Items Report Card */}
        <InventoryReportCard />

        {/* Budgets Report Card */}
        <BudgetReportCard />
      </div>
    </div>
  );
}

export default ReportScreen;