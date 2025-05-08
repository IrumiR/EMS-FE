import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import { CardContent } from "../ui/card";
import toast from "react-hot-toast";
import { useCreateClient } from "@/api/authApi";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function AddUserDialog() {

const [open, setOpen] = useState(false);
const [selectedRoleType, setSelectedRoleType] = useState<string>("");

  const onSuccess = () => {
    formik.resetForm();
    setSelectedRoleType("");
    setOpen(false);
    toast.success("User created successfully!", {
      id: "success-toast",
      position: "top-center",
      duration: 3000,
    });
  };

  const onError = (message: string) => {
    formik.setSubmitting(false);
    toast.error(message, {
      id: "error-toast",
      position: "top-center",
      duration: 4000,
    });
    //   setErrorMessage(message);
  };

  const { mutate: createClient, isLoading } = useCreateClient(
    onSuccess,
    onError
  );

  const validationSchema = Yup.object({
    userName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contactNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      contactNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
      role: "",
      isActive: true,
    },
    validationSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...clientData } = values;
      createClient(clientData);
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // When closing the dialog, reset form and errors without submission
      formik.resetForm({
        values: formik.initialValues,
        errors: {},
        touched: {},
      });
      setSelectedRoleType("");
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="flex gap-1 bg-green-600 py-2 pl-2 sm:pr-2 pr-2 items-center rounded-md text-white max-h-[38px] text-xsxl">
        <div className="flex items-center gap-1">
          <Plus strokeWidth={1.4} />
          <span className="hidden xl:inline">Add User</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
   
      <DialogHeader className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold">Add User</h1>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details to register a new user.
          </DialogDescription>
        </DialogHeader>


        <CardContent className="max-h-[250px] overflow-y-auto space-y-4">
          {[
            { id: "userName", label: "Full Name", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "contactNumber", label: "Phone Number", type: "text" },
            { id: "address", label: "Address", type: "text" },
            { id: "password", label: "Password", type: "password" },
            {
              id: "confirmPassword",
              label: "Confirm Password",
              type: "password",
            },
          ].map(({ id, label, type }) => (
            <div key={id} className="flex flex-col space-y-1.5">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                name={id}
                type={type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={(formik.values as any)[id]}
              />
              {formik.touched[id as keyof typeof formik.touched] &&
                formik.errors[id as keyof typeof formik.errors] && (
                  <span className="text-sm text-red-500">
                    {formik.errors[id as keyof typeof formik.errors]}
                  </span>
                )}
            </div>
          ))}
          <div>
            <Label htmlFor="role" className="text-sm font-medium block mb-1">
              Role
            </Label>
            <Select
              value={selectedRoleType}
              onValueChange={(value) => {
                setSelectedRoleType(value);
                formik.setFieldValue("role", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="team-member">Team Member</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <DialogFooter className="flex justify-between">
          <Button
            type="submit"
            className="bg-green-600"
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
