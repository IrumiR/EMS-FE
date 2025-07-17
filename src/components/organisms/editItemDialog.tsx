import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { FileUpload } from "primereact/fileupload";
import { Textarea } from "../ui/textarea";
import InputField from "../atoms/inputField";
import { useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  useInventoryItem,
  useUpdateInventoryMutation,
} from "@/api/inventoryApi";
import { Loader2 } from "lucide-react";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
}

const validationSchema = Yup.object({
  itemName: Yup.string().required("Item name is required"),
  category: Yup.array().min(1, "At least one category is required"),
  condition: Yup.array().min(1, "At least one condition is required"),
  totalQuantity: Yup.number()
    .positive("Total quantity must be positive")
    .integer("Total quantity must be an integer")
    .required("Total quantity is required"),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  isExternal: Yup.boolean().required(),
});

const categoryOptions = [
  { name: "Audio", id: "Audio" },
  { name: "Lighting", id: "Lighting" },
  { name: "Staging", id: "Staging" },
];

const conditionOptions = [
  { name: "New", id: "New" },
  { name: "Used", id: "Used" },
];

export function EditItemDialog({
  open,
  onOpenChange,
  itemId,
}: EditItemDialogProps) {
  const {
    data: response,
    isLoading: isLoadingItem,
    error,
  } = useInventoryItem(itemId);
  const updateInventoryMutation = useUpdateInventoryMutation();
  const closeRef = useRef<HTMLButtonElement>(null);

  const item = response?.inventoryItem || response?.data || response;

  const formik = useFormik({
    initialValues: {
      itemName: "",
      category: [] as string[],
      condition: [] as string[],
      totalQuantity: "",
      price: "",
      itemDescription: "",
      isExternal: false,
      isSingleUse: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!itemId) return;

      try {
        const updateData = {
          itemName: values.itemName,
          category: values.category,
          condition: values.condition,
          totalQuantity: parseInt(values.totalQuantity),
          price: parseFloat(values.price),
          itemDescription: values.itemDescription,
          isExternal: values.isExternal,
          isSingleUse: values.isSingleUse,
        };

        await updateInventoryMutation.mutateAsync({
          itemId: itemId,
          itemData: updateData,
        });

        toast.success("Item updated successfully!");
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to update item. Please try again.");
        console.error("Update error:", error);
      }
    },
  });

  // Load item data when dialog opens and item data is available
  useEffect(() => {
    if (open && item && typeof item === "object") {
      // For single-use items, use remainingQuantity instead of totalQuantity
      const quantityToShow =
        item.isSingleUse && item.remainingQuantity !== undefined
          ? item.remainingQuantity
          : item.totalQuantity;

      formik.setValues({
        itemName: item.itemName || "",
        category: Array.isArray(item.category)
          ? item.category
          : item.category
          ? [item.category]
          : [],
        condition: Array.isArray(item.condition)
          ? item.condition
          : item.condition
          ? [item.condition]
          : [],
        totalQuantity: quantityToShow ? quantityToShow.toString() : "",
        price: item.price ? item.price.toString() : "",
        itemDescription: item.itemDescription || "",
        isExternal: item.isExternal || false,
        isSingleUse: item.isSingleUse || false,
      });
    }
  }, [open, item]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const categoryItemTemplate = (option: { name: string; id: string }) => {
    return (
      <div className="flex items-center py-1 px-2">
        <span>{option.name}</span>
      </div>
    );
  };

  const conditionItemTemplate = (option: { name: string; id: string }) => {
    return (
      <div className="flex items-center py-1 px-2">
        <span>{option.name}</span>
      </div>
    );
  };

  if (error) {
    toast.error("Failed to load item details");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 w-[90vw] sm:w-[85vw] md:w-[75vw] lg:w-[600px] max-h-[80vh]">
        <ScrollArea className="w-full max-h-[80vh]">
          <form onSubmit={formik.handleSubmit}>
            <DialogHeader>
              <DialogTitle className="py-5 px-4 sm:px-7 -mb-2">
                Edit Item
              </DialogTitle>
              <Separator />
              <DialogDescription className="py-4 px-4 sm:px-7">
                {isLoadingItem ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">
                      Loading item details...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-full">
                      <label
                        htmlFor="itemName"
                        className="text-sm font-medium text-gray-700 text-left"
                      >
                        Item Name
                      </label>
                      <InputField
                        id="itemName"
                        name="itemName"
                        type="text"
                        placeholder="Enter item name"
                        className="h-9 mt-3"
                        value={formik.values.itemName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.itemName && formik.errors.itemName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.itemName}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <div className="w-full mb-4 sm:mb-0">
                        <label
                          htmlFor="category"
                          className="mb-2 text-sm font-medium text-gray-700 text-left"
                        >
                          Category
                        </label>
                        <div className="mt-3">
                          <MultiSelect
                            value={formik.values.category
                              .map((cat) =>
                                categoryOptions.find((opt) => opt.id === cat)
                              )
                              .filter(Boolean)}
                            onChange={(e: MultiSelectChangeEvent) =>
                              formik.setFieldValue(
                                "category",
                                e.value.map((item: any) => item.id)
                              )
                            }
                            options={categoryOptions}
                            optionLabel="name"
                            dataKey="id"
                            placeholder="Select categories"
                            maxSelectedLabels={3}
                            selectedItemsLabel="{0} items selected"
                            className="prime-multiselect w-full h-9"
                            itemTemplate={categoryItemTemplate}
                            style={{ width: "100%" }}
                            appendTo="self"
                            filter={true}
                            showClear={true}
                            panelClassName="prime-panel"
                          />
                        </div>
                        {formik.touched.category && formik.errors.category && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.category}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="condition"
                          className="mb-2 text-sm font-medium text-gray-700 text-left"
                        >
                          Condition
                        </label>
                        <div className="mt-3">
                          <MultiSelect
                            value={formik.values.condition
                              .map((cond) =>
                                conditionOptions.find((opt) => opt.id === cond)
                              )
                              .filter(Boolean)}
                            onChange={(e: MultiSelectChangeEvent) =>
                              formik.setFieldValue(
                                "condition",
                                e.value.map((item: any) => item.id)
                              )
                            }
                            options={conditionOptions}
                            optionLabel="name"
                            dataKey="id"
                            placeholder="Select conditions"
                            maxSelectedLabels={3}
                            selectedItemsLabel="{0} items selected"
                            className="prime-multiselect w-full h-9"
                            itemTemplate={conditionItemTemplate}
                            style={{ width: "100%" }}
                            appendTo="self"
                            filter={true}
                            showClear={true}
                            panelClassName="prime-panel"
                          />
                        </div>
                        {formik.touched.condition &&
                          formik.errors.condition && (
                            <p className="text-red-500 text-xs mt-1">
                              {formik.errors.condition}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <div className="w-full mb-4 sm:mb-0">
                        <label
                          htmlFor="totalQuantity"
                          className="mb-2 text-sm font-medium text-gray-700 text-left"
                        >
                          {item?.isSingleUse
                            ? "Remaining Quantity"
                            : "Total Quantity"}
                        </label>
                        <InputField
                          id="totalQuantity"
                          name="totalQuantity"
                          type="number"
                          placeholder={
                            item?.isSingleUse
                              ? "Enter remaining quantity"
                              : "Enter total quantity"
                          }
                          className="h-9 mt-3"
                          value={formik.values.totalQuantity}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.totalQuantity &&
                          formik.errors.totalQuantity && (
                            <p className="text-red-500 text-xs mt-1">
                              {formik.errors.totalQuantity}
                            </p>
                          )}
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="price"
                          className="mb-2 text-sm font-medium text-gray-700 text-left"
                        >
                          Unit Price
                        </label>
                        <InputField
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          placeholder="Enter price"
                          className="h-9 mt-3"
                          value={formik.values.price}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.price && formik.errors.price && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.price}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="itemDescription"
                        className="mb-2 text-sm font-medium text-gray-700 text-left"
                      >
                        Description
                      </label>
                      <Textarea
                        id="itemDescription"
                        name="itemDescription"
                        placeholder="Enter item description"
                        className="h-24 mt-3"
                        value={formik.values.itemDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.itemDescription &&
                        formik.errors.itemDescription && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.itemDescription}
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor="images"
                        className="mb-2 text-sm font-medium text-gray-700 text-left"
                      >
                        Images
                      </label>
                      <div className="mt-3">
                        <div className="border rounded-md p-2">
                          <FileUpload
                            name="demo[]"
                            url={"/api/upload"}
                            multiple
                            accept="image/*"
                            maxFileSize={1000000}
                            className="w-full custom-file-upload"
                            emptyTemplate={
                              <p className="text-sm text-gray-500 text-center py-4">
                                Drag and drop files here to upload.
                              </p>
                            }
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 1MB. Accepted formats: JPG, PNG, GIF.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-4">
                      <Switch
                        id="isExternal"
                        checked={formik.values.isExternal}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isExternal", checked)
                        }
                      />
                      <Label className="text-sm font-medium text-gray-700">
                        Is External
                      </Label>

                      <Switch
                        id="isSingleUse"
                        checked={formik.values.isSingleUse}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isSingleUse", checked)
                        }
                      />
                      <Label className="text-sm font-medium text-gray-700">
                        Is Single Use
                      </Label>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <DialogFooter className="p-3 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
              <DialogClose
                ref={closeRef}
                className="bg-[#EDF2F6] text-[#475569] hover:bg-slate-200 text-sm font-medium py-2 px-4 rounded-lg w-full sm:w-auto flex justify-center items-center"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={updateInventoryMutation.isLoading || isLoadingItem}
                className="bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg w-full sm:w-auto flex justify-center items-center"
              >
                {updateInventoryMutation.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
