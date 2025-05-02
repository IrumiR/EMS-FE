import React, { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FileUpload } from 'primereact/fileupload';
import { useCreateInventoryMutation } from "@/api/inventoryApi";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../ui/dialog";
import { Separator, Label } from "@radix-ui/react-dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "primereact/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import InputField from "../atoms/inputField";
import { Switch } from "../ui/switch";
import { ScrollArea } from "../ui/scroll-area";


interface AddItemDialogProps {
  dialogTitle?: string;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({ 
  dialogTitle = "Add New Inventory Item" 
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSuccess = () => {
    formik.resetForm();
    toast.success("Item added successfully!", {
      id: "success-toast",
      position: "top-center",
      duration: 3000,
    });
    closeRef.current?.click();
  };

  const onError = (errorMessage: string) => {
    formik.setSubmitting(false);
    toast.error(errorMessage, {
      id: "error-toast",
      position: "top-center",
      duration: 4000,
    });
    setErrorMessage(errorMessage);
  };

  const handleCancel = () => {
    formik.resetForm();
  };

  const { mutate: createInventoryItem, isLoading } = useCreateInventoryMutation(
    onSuccess,
    onError
  );

  const validationSchema = Yup.object({
    itemName: Yup.string().required("Item name is required"),
    category: Yup.string().required("Category is required"),
    condition: Yup.string().required("Condition is required"),
    totalQuantity: Yup.number()
      .required("Total quantity is required")
      .positive("Must be positive")
      .integer("Must be an integer"),
    price: Yup.number()
      .required("Price is required")
      .positive("Must be positive"),
  });

  const formik = useFormik({
    initialValues: {
      itemName: "",
      itemDescription: "",
      category: "",
      condition: "",
      totalQuantity: "",
      price: "",
      isExternal: false,
      assignedEvent:  "",
      createdBy: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const itemData = {
        itemName: values.itemName,
        itemDescription: values.itemDescription,
        category: [values.category],
        condition: [values.condition],
        totalQuantity: Number(values.totalQuantity),
        price: Number(values.price),
        isExternal: values.isExternal,
        assignedEvent: ["68088bccc49d0f40f0dc67e0"],
        createdBy: "68088b26c49d0f40f0dc67d9",
      };
      
      createInventoryItem(itemData);
    },
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex gap-1 bg-green-600 py-2 pl-2 sm:pr-2 pr-2 items-center rounded-md text-white max-h-[38px] text-xsxl">
          <div className="flex items-center gap-1">
            <Plus strokeWidth={1.4} />
            <span className="hidden xl:inline">Add Item</span>
          </div>
        </DialogTrigger>
        <DialogContent className="p-0 w-[90vw] sm:w-[85vw] md:w-[75vw] lg:w-[600px] max-h-[80vh]">
          <ScrollArea className="w-full max-h-[80vh]">
          <form onSubmit={formik.handleSubmit}>
            <DialogHeader>
              <DialogTitle className="py-5 px-4 sm:px-7 -mb-2">
                {dialogTitle}
              </DialogTitle>
              <Separator />
              <DialogDescription className="py-4 px-4 sm:px-7">
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
                    <div className="text-red-500 text-sm self-start">
                      {formik.errors.itemName}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:gap-4 mt-4">
                  <div className="w-full mb-4 sm:mb-0">
                    <label
                      htmlFor="category"
                      className="mb-2 text-sm font-medium text-gray-700 text-left"
                    >
                      Category
                    </label>
                    <Select
                      onValueChange={(val) => formik.setFieldValue("category", val)}
                    >
                      <SelectTrigger className="w-full h-9 mt-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Audio">Audio</SelectItem>
                        <SelectItem value="Lighting">Lighting</SelectItem>
                        <SelectItem value="Staging">Staging</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <div className="text-red-500 text-sm self-start">
                        {formik.errors.category}
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="condition"
                      className="mb-2 text-sm font-medium text-gray-700 text-left"
                    >
                      Condition
                    </label>
                    <Select
                      onValueChange={(val) => formik.setFieldValue("condition", val)}
                    >
                      <SelectTrigger className="w-full h-9 mt-3">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.condition && formik.errors.condition && (
                      <div className="text-red-500 text-sm self-start">
                        {formik.errors.condition}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:gap-4 mt-4">
                  <div className="w-full mb-4 sm:mb-0">
                    <label
                      htmlFor="totalQuantity"
                      className="mb-2 text-sm font-medium text-gray-700 text-left"
                    >
                      Total Quantity
                    </label>
                    <InputField
                      id="totalQuantity"
                      name="totalQuantity"
                      type="text"
                      placeholder="Enter total quantity"
                      className="h-9 mt-3"
                      value={formik.values.totalQuantity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onKeyPress={(e) => {
                        if (!/^\d$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    {formik.touched.totalQuantity && formik.errors.totalQuantity && (
                      <div className="text-red-500 text-sm self-start">
                        {formik.errors.totalQuantity}
                      </div>
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
                      type="text"
                      placeholder="Enter price"
                      className="h-9 mt-3"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onKeyPress={(e) => {
                        if (!/^\d$/.test(e.key) && e.key !== '.') {
                          e.preventDefault();
                        }
                      }}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <div className="text-red-500 text-sm self-start">
                        {formik.errors.price}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
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
                </div>
                
                <div className="mt-4">
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
                        url={'/api/upload'}
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
                
                <div className="flex items-center space-x-2 mt-4">
                  <Switch 
                    id="isExternal"
                    checked={formik.values.isExternal}
                    onCheckedChange={(checked) => formik.setFieldValue("isExternal", checked)}
                  />
                  <Label className="text-sm font-medium text-gray-700">
                    Is External
                  </Label>
                </div>
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <DialogFooter className="p-3 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
              <DialogClose
                ref={closeRef}
                className="bg-[#EDF2F6] text-[#475569] hover:bg-slate-200 text-sm font-medium py-2 px-4 rounded-lg w-full sm:w-auto flex justify-center items-center"
                onClick={handleCancel}
              >
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg w-full sm:w-auto flex justify-center items-center"
              >
                {formik.isSubmitting ? "Submitting..." : "Create Item"}
              </Button>
            </DialogFooter>
          </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddItemDialog;