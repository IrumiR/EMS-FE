import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInventoryItem } from "@/api/inventoryApi";
import { Loader2, Package, Hash, Calendar } from "lucide-react";

interface ViewItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
}

export function ViewItemDialog({
  open,
  onOpenChange,
  itemId,
}: ViewItemDialogProps) {
  const { data: response, isLoading, error } = useInventoryItem(itemId);

  const item = response?.inventoryItem || response?.data || response;

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("LKR", "Rs.");
  };

  // Helper function to get the appropriate quantity to display
  const getDisplayQuantity = (item: any) => {
    return item.isSingleUse ? item.remainingQuantity : item.totalQuantity;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 flex flex-col">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Item Details
            </DialogTitle>
            <DialogDescription>
              Complete information about the selected inventory item.
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-6 pb-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">
                  Loading item details...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load item details</p>
              </div>
            ) : item && typeof item === "object" ? (
              <div className="space-y-6">
                {/* Item Name and Basic Info */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.itemName}
                  </h3>
                  {item.itemDescription && (
                    <p className="text-gray-600 text-sm">
                      {item.itemDescription}
                    </p>
                  )}
                </div>
                {/* Categories and Conditions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Categories
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {item.category &&
                      Array.isArray(item.category) &&
                      item.category.length > 0 ? (
                        item.category.map((cat: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {cat}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No categories
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Conditions
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {item.condition &&
                      Array.isArray(item.condition) &&
                      item.condition.length > 0 ? (
                        item.condition.map((cond: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {cond}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No conditions
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Quantity and Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Quantity</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {getDisplayQuantity(item) || 0}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      Unit Price
                    </p>
                    <p className="text-xl font-semibold text-green-600">
                      {formatPrice(item.price || 0)}
                    </p>
                  </div>
                </div>
                {/* Variations and Source */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {item.variations &&
                    Array.isArray(item.variations) &&
                    item.variations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Variations
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {item.variations.map(
                            (variation: string, index: number) => (
                              <Badge
                                key={index}
                                variant="default"
                                className="text-xs"
                              >
                                {variation}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Source:
                    </h4>
                    <div className="flex flex-wrap">
                      <Badge
                        variant={item.isExternal ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {item.isExternal ? "External" : "Internal"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Reservations */}
                {item.reservations &&
                  Array.isArray(item.reservations) &&
                  item.reservations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Reservations ({item.reservations.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {item.reservations.map(
                          (reservation: any, index: number) => (
                            <div
                              key={reservation._id || index}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-white"
                                  >
                                    {reservation.eventId?.eventName ||
                                      "Unknown Event"}
                                  </Badge>
                                  <span className="text-xs text-gray-600">
                                    Qty: {reservation.reservedQuantity || 0}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {reservation.date
                                    ? new Date(
                                        reservation.date
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : "No date"}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <div>
                      <p className="font-medium">Created</p>
                      <p>
                        {item.createdAt ? formatDate(item.createdAt) : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p>
                        {item.updatedAt ? formatDate(item.updatedAt) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Item ID */}
                <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded">
                  Item ID: {item._id}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No item data available</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t rounded-b-lg">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
