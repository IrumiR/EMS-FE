import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Trash2, Plus, Minus } from "lucide-react";
import { Budget } from "../types";
import { useEditBudget } from "@/hooks/useEditBudget";

interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget;
  budgetId: string;
}

export function EditBudgetDialog({
  open,
  onOpenChange,
  budget,
  budgetId,
}: EditBudgetDialogProps) {
  const {
    formik,
    eventList,
    clientsData,
    inventoryData,
    clientsLoading,
    inventoryLoading,
    isUpdating,
    handleExpenseChange,
    handleInventoryChange,
    handleInventoryItemSelect,
    handleQuantityChange,
    handleAddExpense,
    handleAddInventoryItem,
    handleDeleteExpense,
    handleDeleteInventoryItem,
    handleCancel,
  } = useEditBudget({ budget, budgetId, open, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Budget</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col flex-1 min-h-0"
        >
          <ScrollArea className="flex-1 min-h-0">
            <div className="grid gap-4 py-4 pr-4">
              {/* Client Dropdown */}
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={formik.values.clientId}
                  onValueChange={(value) =>
                    formik.setFieldValue("clientId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading clients...
                        </div>
                      </SelectItem>
                    ) : clientsData?.clients?.length ? (
                      clientsData.clients.map((client) => (
                        <SelectItem key={client.userId} value={client.userId}>
                          {client.userName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-clients" disabled>
                        No clients available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.clientId && formik.errors.clientId && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.clientId}
                  </span>
                )}
              </div>

              {/* Event Dropdown */}
              <div className="grid gap-2">
                <Label htmlFor="event">Event</Label>
                <Select
                  value={formik.values.eventId}
                  onValueChange={(value) =>
                    formik.setFieldValue("eventId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventList.data?.events?.length ? (
                      eventList.data.events.map((event) => (
                        <SelectItem key={event._id} value={event._id}>
                          {event.eventName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-events" disabled>
                        No events available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.eventId && formik.errors.eventId && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.eventId}
                  </span>
                )}
              </div>

              {/* Expenses Section */}
              <div className="grid gap-3 overflow-auto">
                <Label>Expenses</Label>
                {formik.values.expenses.map((expense, index) => (
                  <div key={index}>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start sm:items-center">
                      {/* Expense Name Field */}
                      <Input
                        placeholder="Expense"
                        value={expense.expenseName}
                        onChange={(e) =>
                          handleExpenseChange(
                            index,
                            "expenseName",
                            e.target.value
                          )
                        }
                        className="w-full"
                      />

                      {/* Amount Field */}
                      <Input
                        placeholder="Value"
                        type="number"
                        value={expense.amount}
                        onChange={(e) =>
                          handleExpenseChange(index, "amount", e.target.value)
                        }
                        className="w-full"
                      />

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 justify-self-end sm:justify-self-auto"
                        disabled={formik.values.expenses.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Validation errors for this expense */}
                    {formik.touched.expenses?.[index] &&
                      formik.errors.expenses?.[index] && (
                        <div className="mt-1">
                          {typeof formik.errors.expenses[index] ===
                            "object" && (
                            <>
                              {(formik.errors.expenses[index] as any)
                                ?.expenseName && (
                                <span className="text-red-500 text-sm block">
                                  {
                                    (formik.errors.expenses[index] as any)
                                      .expenseName
                                  }
                                </span>
                              )}
                              {(formik.errors.expenses[index] as any)
                                ?.amount && (
                                <span className="text-red-500 text-sm block">
                                  {
                                    (formik.errors.expenses[index] as any)
                                      .amount
                                  }
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      )}
                  </div>
                ))}

                {/* Add Expenses Button */}
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddExpense}
                    className="w-full"
                  >
                    Add Expenses
                  </Button>
                </div>
              </div>

              {/* Inventory Items Section */}
              <div className="grid gap-3">
                <Label>Inventory Items</Label>
                {formik.values.inventoryItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      {/* Inventory Item Dropdown */}
                      <Select
                        value={item.itemId}
                        onValueChange={(value) =>
                          handleInventoryItemSelect(index, value)
                        }
                      >
                        <SelectTrigger className="w-full sm:w-36 flex-shrink-0">
                          <SelectValue placeholder="Select Item" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryLoading ? (
                            <SelectItem value="loading" disabled>
                              <div className="flex items-center">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading inventory...
                              </div>
                            </SelectItem>
                          ) : inventoryData?.items?.length ? (
                            inventoryData.items.map((inventoryItem) => (
                              <SelectItem
                                key={inventoryItem.itemId}
                                value={inventoryItem.itemId}
                              >
                                {inventoryItem.itemName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-items" disabled>
                              No inventory items available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 border rounded-md flex-shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(index, false)}
                          className="h-8 w-8 p-0"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = Math.min(
                              Math.max(1, parseInt(e.target.value) || 1),
                              item.maxQuantity || 1
                            );
                            handleInventoryChange(
                              index,
                              "quantity",
                              newQuantity
                            );
                          }}
                          className="w-16 text-center border-0 focus-visible:ring-0 h-8"
                          min="1"
                          max={item.maxQuantity || 1}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(index, true)}
                          className="h-8 w-8 p-0"
                          disabled={item.quantity >= (item.maxQuantity || 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price Field */}
                      <Input
                        placeholder="Price"
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleInventoryChange(index, "price", e.target.value)
                        }
                        className="w-full min-w-[100px] sm:w-28 flex-shrink-0"
                        readOnly
                      />

                      {/* Delete Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInventoryItem(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 justify-self-end sm:justify-self-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Inventory validation errors */}
                    {formik.touched.inventoryItems?.[index] &&
                      formik.errors.inventoryItems?.[index] && (
                        <div className="text-red-500 text-sm mt-1">
                          {typeof formik.errors.inventoryItems[index] ===
                          "object" ? (
                            <>
                              {(formik.errors.inventoryItems[index] as any)
                                ?.itemId && (
                                <div>
                                  {
                                    (formik.errors.inventoryItems[index] as any)
                                      .itemId
                                  }
                                </div>
                              )}
                              {(formik.errors.inventoryItems[index] as any)
                                ?.quantity && (
                                <div>
                                  {
                                    (formik.errors.inventoryItems[index] as any)
                                      .quantity
                                  }
                                </div>
                              )}
                              {(formik.errors.inventoryItems[index] as any)
                                ?.price && (
                                <div>
                                  {
                                    (formik.errors.inventoryItems[index] as any)
                                      .price
                                  }
                                </div>
                              )}
                            </>
                          ) : (
                            <div>{formik.errors.inventoryItems[index]}</div>
                          )}
                        </div>
                      )}
                  </div>
                ))}

                {/* Add Inventory Button */}
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddInventoryItem}
                    className="w-full"
                  >
                    Add Inventory
                  </Button>
                </div>
              </div>

              {/* Total Amount Field */}
              <div className="grid gap-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  placeholder="Total Amount"
                  type="number"
                  value={formik.values.totalAmount}
                  onChange={formik.handleChange}
                  className="w-full"
                  readOnly
                />
                {formik.touched.totalAmount && formik.errors.totalAmount && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.totalAmount}
                  </span>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="flex justify-between sm:justify-between pt-4 border-t flex-shrink-0">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
