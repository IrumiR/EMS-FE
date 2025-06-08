import { AddBudgetDialog } from "@/components/organisms/addBudgetDialog";
import BudgetCard from "@/components/molecules/budgetCard";

function BudgetScreen() {
  const hasBudgets = true;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget</h1>
          <p className="mt-4 text-gray-600">
            Manage and track your expenses here.
          </p>
        </div>

        <div>
          <AddBudgetDialog />
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-8">
        {hasBudgets ? (
          <div>
            <BudgetCard />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-36">
            <p className="text-gray-500 text-lg">No budgets found.</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">
              Previous
            </button>
            <span className="text-sm text-gray-700">Page</span>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50">
              Next
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Budgets per page:</span>
            <select className="px-2 py-1 border border-gray-300 rounded">
              {[5, 10, 15, 20].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetScreen;
