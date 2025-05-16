import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

function EventDetailedScreen() {
  // State for form fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [tasks, setTasks] = useState([{ id: 1, name: "", assignee: "" }]);
  const [inventoryItems, setInventoryItems] = useState([{ id: 1, name: "", quantity: 1 }]);

  // Handle adding new task
  const addTask = () => {
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    setTasks([...tasks, { id: newId, name: "", assignee: "" }]);
  };

  // Handle removing task
  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Handle task field change
  const handleTaskChange = (id: number, field: string, value: any) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  // Handle adding new inventory item
  const addInventoryItem = () => {
    const newId = inventoryItems.length > 0 ? inventoryItems[inventoryItems.length - 1].id + 1 : 1;
    setInventoryItems([...inventoryItems, { id: newId, name: "", quantity: 1 }]);
  };

  // Handle removing inventory item
  const removeInventoryItem = (id: number) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  // Handle inventory item field change
  const handleInventoryItemChange = (id: number, field: string, value: any) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Process form data here
    console.log({
      eventTitle,
      eventType,
      status,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      client,
      tasks,
      inventoryItems
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input 
                  id="eventTitle" 
                  value={eventTitle} 
                  onChange={(e) => setEventTitle(e.target.value)} 
                  className="w-full mt-1" 
                  required
                />
              </div>

              {/* Event Type */}
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Input 
                  id="eventType" 
                  value={eventType} 
                  onChange={(e) => setEventType(e.target.value)} 
                  className="w-full mt-1" 
                  required
                />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status} 
                  onValueChange={setStatus}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending approval">Pending Approval</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="hold">Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3} 
                  className="w-full mt-1" 
                />
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Calendar 
                  id="startDate" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.value ?? null)} 
                  dateFormat="dd/mm/yy"
                  showIcon
                  className="w-full mt-1" 
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Calendar 
                  id="endDate" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.value ?? null)} 
                  dateFormat="dd/mm/yy"
                  showIcon
                  className="w-full mt-1" 
                  required
                />
              </div>

              {/* Start Time */}
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Calendar 
                  id="startTime" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.value ?? null)} 
                  timeOnly 
                  hourFormat="12" 
                  showIcon
                  className="w-full mt-1" 
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Calendar 
                  id="endTime" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.value ?? null)} 
                  timeOnly 
                  hourFormat="12" 
                  showIcon
                  className="w-full mt-1" 
                  required
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="w-full mt-1" 
                  required
                />
              </div>

              {/* Client */}
              <div>
                <Label htmlFor="client">Client</Label>
                <Input 
                  id="client" 
                  value={client} 
                  onChange={(e) => setClient(e.target.value)} 
                  className="w-full mt-1" 
                  required
                />
              </div>

              {/* Quotation File */}
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="quotation">Quotation</Label>
                <Input 
                  id="quotation" 
                  type="file" 
                  accept="application/pdf" 
                  className="w-full mt-1" 
                />
              </div>
            </div>

            {/* Tasks Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline"
                  onClick={addTask}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              <Separator className="mb-4" />
              
              {tasks.map((task) => (
                <div key={task.id} className="mb-4 p-4 border rounded-md bg-white">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium">Task #{task.id}</h4>
                    <Button 
                      type="button" 
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTask(task.id)}
                      disabled={tasks.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Task Name</Label>
                      <Input 
                        value={task.name} 
                        onChange={(e) => handleTaskChange(task.id, 'name', e.target.value)} 
                        className="w-full mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Assignee</Label>
                      <Input 
                        value={task.assignee} 
                        onChange={(e) => handleTaskChange(task.id, 'assignee', e.target.value)} 
                        className="w-full mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Inventory Items Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Inventory Items</h3>
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline"
                  onClick={addInventoryItem}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
              <Separator className="mb-4" />
              
              {inventoryItems.map((item) => (
                <div key={item.id} className="mb-4 p-4 border rounded-md bg-white">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium">Item #{item.id}</h4>
                    <Button 
                      type="button" 
                      size="sm"
                      variant="ghost"
                      onClick={() => removeInventoryItem(item.id)}
                      disabled={inventoryItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Item Name</Label>
                      <Input 
                        value={item.name} 
                        onChange={(e) => handleInventoryItemChange(item.id, 'name', e.target.value)} 
                        className="w-full mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Quantity</Label>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleInventoryItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)} 
                        className="w-full mt-1"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>


            <div className="flex justify-end space-x-4 mt-8">
              <Button 
                type="button" 
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Approve
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventDetailedScreen;