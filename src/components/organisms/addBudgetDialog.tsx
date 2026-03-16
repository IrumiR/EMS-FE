import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Minus } from "lucide-react";
import { useBudget } from "@/hooks/useBudget";

export function AddBudgetDialog() {
  const {
    isOpen,
    setIsOpen,
    formik,
    clientsData,
    clientsLoading,
    inventoryData,
    inventoryLoading,
    eventList,
    createBudgetMutation,
    handleExpenseChange,
    handleInventoryChange,
    handleInventoryItemSelect,
    handleQuantityChange,
    handleDiscountChange,
    handleAddExpense,
    handleAddInventoryItem,
    handleDeleteExpense,
    handleDeleteInventoryItem,
    handleCancel,
    handleCreateBudget,
    calculateSubtotal,
  } = useBudget();

  const subtotal = calculateSubtotal();
  const discountPercent = parseFloat(formik.values.discountPercentage) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex gap-1 bg-green-600 py-2 pl-2 sm:pr-2 pr-2 items-center rounded-md text-white max-h-[38px] text-xsxl">
        <div className="flex items-center gap-1">
          <Plus strokeWidth={1.4} />
          <span className="hidden xl:inline">Create Budget</span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-center">Add Budget</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formik.values.selectedClientId}
                onValueChange={(value) => {
                  formik.setFieldValue("selectedClientId", value);
                  formik.setFieldValue("selectedEventId", "");
                }}
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
              {formik.touched.selectedClientId &&
                formik.errors.selectedClientId && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.selectedClientId}
                  </span>
                )}
            </div>

            {/* Event Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="event">Event</Label>
              <Select
                value={formik.values.selectedEventId}
                onValueChange={(value) =>
                  formik.setFieldValue("selectedEventId", value)
                }
                disabled={!formik.values.selectedClientId}
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

              {formik.touched.selectedEventId &&
                formik.errors.selectedEventId && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.selectedEventId}
                  </span>
                )}
            </div>

            {/* Expenses Section */}
            <div className="grid gap-3">
              <Label>Expenses</Label>
              {formik.values.expenses.map((expense, index) => (
                <div key={index}>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start sm:items-center">
                    <Input
                      placeholder="Expense"
                      value={expense.expense}
                      onChange={(e) =>
                        handleExpenseChange(index, "expense", e.target.value)
                      }
                      className="w-full"
                    />

                    <Input
                      placeholder="Value"
                      type="number"
                      value={expense.value}
                      onChange={(e) =>
                        handleExpenseChange(index, "value", e.target.value)
                      }
                      className="w-full"
                    />

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
                  {formik.touched.expenses?.[index] &&
                    formik.errors.expenses?.[index] && (
                      <div className="text-red-500 text-sm mt-1">
                        {typeof formik.errors.expenses[index] === "object" ? (
                          <>
                            {(formik.errors.expenses[index] as any)
                              ?.expense && (
                              <div>
                                {(formik.errors.expenses[index] as any).expense}
                              </div>
                            )}
                            {(formik.errors.expenses[index] as any)?.value && (
                              <div>
                                {(formik.errors.expenses[index] as any).value}
                              </div>
                            )}
                          </>
                        ) : (
                          <div>{formik.errors.expenses[index]}</div>
                        )}
                      </div>
                    )}
                </div>
              ))}

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
                        onChange={(e) =>
                          handleInventoryChange(
                            index,
                            "quantity",
                            Math.min(
                              parseInt(e.target.value) || 1,
                              item.maxQuantity || 1,
                            ),
                          )
                        }
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

            {/* <div className="grid gap-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <div className="relative">
                <Input
                  id="discount"
                  placeholder="Enter discount percentage"
                  type="number"
                  value={formik.values.discountPercentage}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="w-full pr-8"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {formik.touched.discountPercentage &&
                formik.errors.discountPercentage && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.discountPercentage}
                  </span>
                )}
            </div> */}

            {/* Total Calculation Summary */}
            <div className="grid gap-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span>Subtotal:</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Discount ({discountPercent}%):</span>
                  <span>-Rs.{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

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

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleCreateBudget}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={createBudgetMutation.isLoading}
          >
            {createBudgetMutation.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Budget"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
