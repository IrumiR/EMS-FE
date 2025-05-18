import { useEffect } from "react";
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
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useGetEventById, useUpdateEvent } from "@/api/eventApi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function EventEditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // API hooks for fetching and updating event data
  const { 
    data: eventData, 
    isLoading: isLoadingEvent, 
    error: eventError 
  } = useGetEventById(id ?? null);

  const { 
    mutate: updateEvent, 
    isLoading: isUpdating, 
    error: updateError 
  } = useUpdateEvent(
    id as string,
    {
      onSuccess: (data: any) => {
        toast.success('Event updated successfully');
        navigate('/events');
      },
      onError: (error: any) => {
        toast.error(`Failed to update event: ${error.message}`);
      }
    }
  );

  // Validation schema using Yup
  const validationSchema = Yup.object({
    eventTitle: Yup.string().required('Event title is required'),
    eventType: Yup.string().required('Event type is required'),
    status: Yup.string().required('Status is required'),
    description: Yup.string(),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(
        Yup.ref('startDate'), 
        'End date must be after start date'
      ),
    startTime: Yup.date().required('Start time is required'),
    endTime: Yup.date()
      .required('End time is required')
      .test(
        'is-after-start',
        'End time must be after start time',
        function(endTime) {
          const { startDate, endDate, startTime } = this.parent;
          if (!startTime || !endTime || !startDate || !endDate) return true;
          
          // Compare times only if dates are the same
          if (startDate.toDateString() === endDate.toDateString()) {
            return endTime.getTime() > startTime.getTime();
          }
          return true;
        }
      ),
    location: Yup.string().required('Location is required'),
    client: Yup.string().required('Client is required'),
    tasks: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Task name is required'),
        assignee: Yup.string()
      })
    ),
    inventoryItems: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Item name is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .positive('Quantity must be positive')
          .integer('Quantity must be a whole number')
      })
    )
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      eventTitle: "",
      eventType: "",
      status: "",
      description: "",
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      location: "",
      client: "",
      quotationFile: null,
      tasks: [{ id: 1, name: "", assignee: "" }],
      inventoryItems: [{ id: 1, name: "", quantity: 1 }]
    },
    validationSchema,
    onSubmit: (values) => {
      // Format data for API submission
      const formData = new FormData();
      
      // Convert values to format needed by API
      const eventPayload = {
        title: values.eventTitle,
        type: values.eventType,
        status: values.status,
        description: values.description,
        startDateTime: combineDateTime(values.startDate, values.startTime),
        endDateTime: combineDateTime(values.endDate, values.endTime),
        location: values.location,
        client: values.client,
        tasks: values.tasks.map(({ id, ...rest }) => rest), // Remove client-side ID
        inventoryItems: values.inventoryItems.map(({ id, ...rest }) => rest) // Remove client-side ID
      };
      
      // Append the JSON data
      formData.append('eventData', JSON.stringify(eventPayload));
      
      // Append the file if it exists
      if (values.quotationFile) {
        formData.append('quotationFile', values.quotationFile);
      }
      
      // Call the API
      updateEvent(
        { id, formData },
        {
          onSuccess: () => {
            toast.success('Event updated successfully');
            navigate('/events'); // Navigate back to events list
          },
          onError: (error) => {
            toast.error(`Failed to update event: ${error.message}`);
          }
        }
      );
    }
  });

  // Helper function to combine date and time
  function combineDateTime(date, time) {
    if (!date || !time) return null;
    
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(time.getSeconds());
    
    return combined.toISOString();
  }

  // Populate form with existing data when loaded
  useEffect(() => {
    if (eventData) {
      // Parse dates from API
      const startDateTime = eventData.startDateTime ? new Date(eventData.startDateTime) : null;
      const endDateTime = eventData.endDateTime ? new Date(eventData.endDateTime) : null;
      
      // Extract time portion for time fields
      const startTime = startDateTime ? new Date(startDateTime) : null;
      const endTime = endDateTime ? new Date(endDateTime) : null;
      
      // Extract date portion for date fields (remove time component)
      const startDate = startDateTime ? new Date(startDateTime.setHours(0, 0, 0, 0)) : null;
      const endDate = endDateTime ? new Date(endDateTime.setHours(0, 0, 0, 0)) : null;
      
      formik.setValues({
        eventTitle: eventData.title || "",
        eventType: eventData.type || "",
        status: eventData.status || "",
        description: eventData.description || "",
        startDate,
        endDate,
        startTime,
        endTime,
        location: eventData.location || "",
        client: eventData.client || "",
        quotationFile: null, // File inputs can't be pre-filled for security reasons
        tasks: eventData.tasks?.length > 0 
          ? eventData.tasks.map((task, index) => ({ 
              id: index + 1, 
              name: task.name, 
              assignee: task.assignee 
            }))
          : [{ id: 1, name: "", assignee: "" }],
        inventoryItems: eventData.inventoryItems?.length > 0 
          ? eventData.inventoryItems.map((item, index) => ({ 
              id: index + 1, 
              name: item.name, 
              quantity: item.quantity 
            }))
          : [{ id: 1, name: "", quantity: 1 }]
      });
    }
  }, [eventData]);

  // Handle adding new task
  const addTask = () => {
    const newId = formik.values.tasks.length > 0 
      ? Math.max(...formik.values.tasks.map(t => t.id)) + 1 
      : 1;
    
    formik.setFieldValue('tasks', [
      ...formik.values.tasks, 
      { id: newId, name: "", assignee: "" }
    ]);
  };

  // Handle removing task
  const removeTask = (id) => {
    if (formik.values.tasks.length === 1) return;
    
    formik.setFieldValue(
      'tasks', 
      formik.values.tasks.filter(task => task.id !== id)
    );
  };

  // Handle adding new inventory item
  const addInventoryItem = () => {
    const newId = formik.values.inventoryItems.length > 0 
      ? Math.max(...formik.values.inventoryItems.map(i => i.id)) + 1 
      : 1;
    
    formik.setFieldValue('inventoryItems', [
      ...formik.values.inventoryItems, 
      { id: newId, name: "", quantity: 1 }
    ]);
  };

  // Handle removing inventory item
  const removeInventoryItem = (id) => {
    if (formik.values.inventoryItems.length === 1) return;
    
    formik.setFieldValue(
      'inventoryItems', 
      formik.values.inventoryItems.filter(item => item.id !== id)
    );
  };

  // Handle file input change
  const handleFileChange = (e) => {
    formik.setFieldValue('quotationFile', e.target.files[0]);
  };

  // Show loading state
  if (isLoadingEvent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading event data...</span>
      </div>
    );
  }

  // Show error state
  if (eventError) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-screen">
        <Card className="shadow-md bg-red-50">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-red-700">Error Loading Event</h2>
            <p className="text-red-600">{eventError.message || "Failed to load event data"}</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/events')}
            >
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input 
                  id="eventTitle" 
                  name="eventTitle"
                  value={formik.values.eventTitle} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full mt-1 ${
                    formik.touched.eventTitle && formik.errors.eventTitle 
                      ? "border-red-500" 
                      : ""
                  }`}
                />
                {formik.touched.eventTitle && formik.errors.eventTitle && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.eventTitle}</div>
                )}
              </div>

              {/* Event Type */}
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Input 
                  id="eventType" 
                  name="eventType"
                  value={formik.values.eventType} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full mt-1 ${
                    formik.touched.eventType && formik.errors.eventType 
                      ? "border-red-500" 
                      : ""
                  }`}
                />
                {formik.touched.eventType && formik.errors.eventType && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.eventType}</div>
                )}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formik.values.status}
                  onValueChange={(value) => formik.setFieldValue('status', value)}
                >
                  <SelectTrigger 
                    className={`w-full mt-1 ${
                      formik.touched.status && formik.errors.status 
                        ? "border-red-500" 
                        : ""
                    }`}
                    onBlur={() => formik.setFieldTouched('status', true)}
                  >
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
                {formik.touched.status && formik.errors.status && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
                )}
              </div>

              {/* Description */}
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formik.values.description} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={3} 
                  className="w-full mt-1" 
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                )}
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Calendar 
                  id="startDate" 
                  value={formik.values.startDate} 
                  onChange={(e) => formik.setFieldValue('startDate', e.value)} 
                  onBlur={() => formik.setFieldTouched('startDate', true)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  className={`w-full mt-1 ${
                    formik.touched.startDate && formik.errors.startDate 
                      ? "border-red-500" 
                      : ""
                  }`}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.startDate}</div>
                )}
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Calendar 
                  id="endDate" 
                  value={formik.values.endDate} 
                  onChange={(e) => formik.setFieldValue('endDate', e.value)} 
                  onBlur={() => formik.setFieldTouched('endDate', true)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  className={`w-full mt-1 ${
                    formik.touched.endDate && formik.errors.endDate 
                      ? "border-red-500" 
                      : ""
                  }`}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.endDate}</div>
                )}
              </div>

              {/* Start Time */}
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Calendar 
                  id="startTime" 
                  value={formik.values.startTime} 
                  onChange={(e) => formik.setFieldValue('startTime', e.value)} 
                  onBlur={() => formik.setFieldTouched('startTime', true)}
                  timeOnly 
                  hourFormat="12" 
                  showIcon
                  className={`w-full mt-1 ${
                    formik.touched.startTime && formik.errors.startTime 
                      ? "border-red-500" 
                      : ""
                  }`}
                />
                {formik.touched.startTime && formik.errors.startTime && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.startTime}</div>
                )}
              </div>

              {/* End Time */}
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Calendar 
                  id="endTime" 
                  value={formik.values.endTime} 
                  onChange={(e) => formik.setFieldValue('endTime', e.value)} 
                  onBlur={() => formik.setFieldTouched('endTime', true)}
                  timeOnly 
                  hourFormat="12" 
                  showIcon
                  className={`w-full mt-1 ${
                    formik.touched.endTime && formik.errors.endTime 
                      ? "border-red-500" 
                      : ""
                  }`}
                />
                {formik.touched.endTime && formik.errors.endTime && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.endTime}</div>
                )}
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location"
                  value={formik.values.location} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full mt-1 ${
                    formik.touched.location && formik.errors.location 
                      ? "border-red-500" 
                      : ""
                  }`}
                />
                {formik.touched.location && formik.errors.location && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.location}</div>
                )}
              </div>

              {/* Client */}
              <div>
                <Label htmlFor="client">Client</Label>
                <Input 
                  id="client" 
                  name="client"
                  value={formik.values.client} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full mt-1 ${
                    formik.touched.client && formik.errors.client 
                      ? "border-red-500" 
                      : ""
                  }`}
                />
                {formik.touched.client && formik.errors.client && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.client}</div>
                )}
              </div>

              {/* Quotation File */}
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="quotationFile">Quotation</Label>
                <Input 
                  id="quotationFile" 
                  name="quotationFile"
                  type="file" 
                  accept="application/pdf" 
                  className="w-full mt-1"
                  onChange={handleFileChange}
                />
                {formik.values.quotationFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {formik.values.quotationFile.name}
                  </p>
                )}
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
              
              {formik.values.tasks.map((task, index) => (
                <div key={task.id} className="mb-4 p-4 border rounded-md bg-white">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium">Task #{index + 1}</h4>
                    <Button 
                      type="button" 
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTask(task.id)}
                      disabled={formik.values.tasks.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Task Name</Label>
                      <Input 
                        name={`tasks[${index}].name`}
                        value={task.name} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full mt-1 ${
                          formik.touched.tasks?.[index]?.name && formik.errors.tasks?.[index]?.name 
                            ? "border-red-500" 
                            : ""
                        }`}
                      />
                      {formik.touched.tasks?.[index]?.name && formik.errors.tasks?.[index]?.name && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.tasks[index].name}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs">Assignee</Label>
                      <Input 
                        name={`tasks[${index}].assignee`}
                        value={task.assignee} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
              
              {formik.values.inventoryItems.map((item, index) => (
                <div key={item.id} className="mb-4 p-4 border rounded-md bg-white">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium">Item #{index + 1}</h4>
                    <Button 
                      type="button" 
                      size="sm"
                      variant="ghost"
                      onClick={() => removeInventoryItem(item.id)}
                      disabled={formik.values.inventoryItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Item Name</Label>
                      <Input 
                        name={`inventoryItems[${index}].name`}
                        value={item.name} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full mt-1 ${
                          formik.touched.inventoryItems?.[index]?.name && 
                          formik.errors.inventoryItems?.[index]?.name 
                            ? "border-red-500" 
                            : ""
                        }`}
                      />
                      {formik.touched.inventoryItems?.[index]?.name && 
                       formik.errors.inventoryItems?.[index]?.name && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.inventoryItems[index].name}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs">Quantity</Label>
                      <Input 
                        type="number" 
                        name={`inventoryItems[${index}].quantity`}
                        value={item.quantity} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full mt-1 ${
                          formik.touched.inventoryItems?.[index]?.quantity && 
                          formik.errors.inventoryItems?.[index]?.quantity 
                            ? "border-red-500" 
                            : ""
                        }`}
                        min="1"
                      />
                      {formik.touched.inventoryItems?.[index]?.quantity && 
                       formik.errors.inventoryItems?.[index]?.quantity && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.inventoryItems[index].quantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form submission error message */}
            {updateError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                {updateError.message || "An error occurred while saving the event."}
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/events')}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isUpdating || !formik.isValid}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Event'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventEditScreen;