import { useState, useEffect } from "react";
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

import { CardContent } from "../ui/card";
import toast from "react-hot-toast";
import { useUpdateUserMutation, useGetUserById } from "@/api/authApi";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EditUserDialogProps {
  userId: string;
  trigger: React.ReactNode;
}

export function EditUserDialog({ userId, trigger }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedRoleType, setSelectedRoleType] = useState("");

  // Fetch user data when dialog opens
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(open ? userId : null);

  const onSuccess = () => {
    setOpen(false);
    toast.success("User updated successfully!", {
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
  };

  const { mutate: updateUser, isLoading: isUpdating } = useUpdateUserMutation(
    onSuccess,
    onError
  );

  const validationSchema = Yup.object({
    userName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contactNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    // Password fields are optional for updates
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .nullable(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .when("password", {
        is: (password: string | undefined) => password && password.length > 0,
        then: (schema) => schema.required("Please confirm your password"),
        otherwise: (schema) => schema.nullable(),
      }),
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
      const { confirmPassword, ...userData } = values;
      
      const updateData = {
        ...userData,
        ...(values.password ? { password: values.password } : {}),
        role: values.role as "admin" | "manager" | "team-member" | "client" | undefined,
      };
      
      updateUser({
        userId: userId,
        userData: updateData
      });
    },
  });

  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      formik.resetForm({
        values: {
          userName: user.userName || "",
          email: user.email || "",
          contactNumber: user.contactNumber || "",
          address: user.address || "",
          password: "", // Don't prefill password
          confirmPassword: "", // Don't prefill confirm password
          role: user.role || "",
          isActive: user.isActive !== undefined ? user.isActive : true,
        },
      });
      setSelectedRoleType(user.role || "");
    }
  }, [userData]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      formik.resetForm();
      setSelectedRoleType("");
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold">Update User</h1>
          <DialogDescription className="text-sm text-muted-foreground">
            Edit user details below.
          </DialogDescription>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="flex justify-center py-8">Loading user data...</div>
        ) : (
          <>
            <CardContent className="max-h-[250px] overflow-y-auto space-y-4">
              {[
                { id: "userName", label: "Full Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "contactNumber", label: "Phone Number", type: "text" },
                { id: "address", label: "Address", type: "text" },
                { id: "password", label: "New Password (optional)", type: "password" },
                {
                  id: "confirmPassword",
                  label: "Confirm New Password",
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
                    value={String(formik.values[id as keyof typeof formik.values])}
                  />
                  {formik.touched[id as keyof typeof formik.values] && formik.errors[id as keyof typeof formik.values] && (
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
                {formik.touched.role && formik.errors.role && (
                  <span className="text-sm text-red-500">
                    {formik.errors.role}
                  </span>
                )}
              </div>
            </CardContent>
            <DialogFooter className="flex justify-between">
              <Button
                type="submit"
                className="bg-green-600"
                disabled={isUpdating}
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                {isUpdating ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}