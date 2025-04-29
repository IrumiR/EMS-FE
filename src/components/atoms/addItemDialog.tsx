import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

interface AddItemDialogProps {
  triggerButton?: React.ReactNode;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({ triggerButton }) => {
  const [variationInput, setVariationInput] = useState("");
  const [variations, setVariations] = useState<string[]>([]);
  const toast = useRef(null);

  const handleAddVariation = () => {
    if (variationInput.trim()) {
      setVariations([...variations, variationInput.trim()]);
      setVariationInput("");
    }
  };

  const handleRemoveVariation = (index: number) => {
    const newVariations = [...variations];
    newVariations.splice(index, 1);
    setVariations(newVariations);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddVariation();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-full max-w-[100vw] sm:max-w-[425px] max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Fill out the item details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="mb-3">
                  Item Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="block mb-3">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition" className="block mb-3">
                  Condition
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="totalQuantity" className="mb-3">
                  Total Quantity
                </Label>
                <Input
                  id="totalQuantity"
                  placeholder="Enter total quantity"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="description" className="mb-2">Description</Label>
          
              <Textarea placeholder="Type your message here." id="description" />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="images" className="mb-2">Images</Label>
              <div className="mt-1">
                <Toast ref={toast} />
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

            <div className="flex items-center space-x-2 py-2">
              <Switch id="isExternal" />
              <Label htmlFor="isExternal">Is External</Label>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end pb-3 sm:pb-0">
          <Button variant="outline" type="button" className="sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 text-white sm:w-auto">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;