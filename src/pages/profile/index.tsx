import { useGetUserById, useUpdateUserMutation } from "@/api/authApi";
import { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ProfileScreen() {
  const userId = localStorage.getItem("userId");
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId);

  const onSuccess = () => {
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
    password: Yup.string().min(6, "Minimum 6 characters").nullable(),
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
      profileImage: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...userData } = values;

      const updateData = {
        ...userData,
        ...(values.password && values.password.trim().length > 0
          ? { password: values.password }
          : {}),
        role: values.role as
          | "admin"
          | "manager"
          | "team-member"
          | "client"
          | undefined,
      };

      if (!userId) {
        toast.error("User ID is missing.", {
          id: "missing-userid-toast",
          position: "top-center",
          duration: 4000,
        });
        return;
      }

      updateUser({
        userId: userId,
        userData: updateData,
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
          password: "",
          confirmPassword: "",
          role: user.role || "",
          profileImage: user.profileImage || "01",
          isActive: user.isActive !== undefined ? user.isActive : true,
        },
      });
    }
  }, [userData]);

  return (
    <>
      {isLoadingUser ? (
        <div className="flex justify-center py-8">Loading user data...</div>
      ) : (
        <>
          <div className="lg:flex gap-5">
            <div className="">
              <Label className="block text-lg font-medium mb-4">
                Profile Image
              </Label>

              <div className="flex flex-col items-center mb-6">
                <img
                  src={`/profile-avatar/${
                    formik.values.profileImage || "01"
                  }.png`}
                  alt="Selected Profile"
                  className="max-w-52 max-h-52 rounded-full border-4 border-teal-500 shadow bg-teal-200"
                />
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 gap-4">
                {[...Array(10)].map((_, index) => {
                  const paddedIndex = String(index + 1).padStart(2, "0");
                  const profileValue = paddedIndex;
                  const isSelected =
                    formik.values.profileImage === profileValue;

                  return (
                    <div
                      key={profileValue}
                      onClick={() =>
                        formik.setFieldValue("profileImage", profileValue)
                      }
                      className={`relative group cursor-pointer rounded-lg p-1 border-2 transition-all duration-200
            ${
              isSelected
                ? "border-blue-500 shadow-md"
                : "border-transparent hover:border-gray-300"
            }`}
                    >
                      <img
                        src={`/profile-avatar/${profileValue}.png`}
                        alt={`Avatar ${paddedIndex}`}
                        className="w-16 h-16 rounded-full object-cover mx-auto"
                      />
                      {isSelected && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className=" space-y-4  w-1/2">
              {[
                { id: "userName", label: "Full Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "contactNumber", label: "Phone Number", type: "text" },
                { id: "address", label: "Address", type: "text" },
                {
                  id: "password",
                  label: "New Password (optional)",
                  type: "password",
                },
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
                    value={String(
                      formik.values[id as keyof typeof formik.values]
                    )}
                  />
                  {formik.touched[id as keyof typeof formik.values] &&
                    formik.errors[id as keyof typeof formik.values] && (
                      <span className="text-sm text-red-500">
                        {formik.errors[id as keyof typeof formik.errors]}
                      </span>
                    )}
                </div>
              ))}
              <Button
                type="submit"
                className="bg-green-600 mt-6"
                disabled={isUpdating}
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProfileScreen;