import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/assets/svg/sidebar-logo.svg";
import { useCreateClient } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

function Register() {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate(); // 👈 initialize

  const onSuccess = () => {
    formik.resetForm();
    toast.success("Client registered successfully!", {
      id: "success-toast",
      position: "top-center",
      duration: 3000,
    });
    navigate("/login"); // 👈 redirect to login
  };

  const onError = (message: string) => {
    formik.setSubmitting(false);
    toast.error(message, {
      id: "error-toast",
      position: "top-center",
      duration: 4000,
    });
    setErrorMessage(message);
  };

  const { mutate: createClient, isLoading } = useCreateClient(onSuccess, onError);

  const validationSchema = Yup.object({
    userName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contactNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
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
      role: "client",
      isActive: true,
    },
    validationSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...clientData } = values;
      createClient(clientData);
    },
  });

  return (
    <div className="bg-[#e6f8f4] min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-xl">
        <form onSubmit={formik.handleSubmit}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <img src={Logo} alt="EvoMo Logo" className="w-8 h-8" />
              <CardTitle className="font-bold text-xl">EvoMo</CardTitle>
            </div>
            <div className="text-center">
              <CardDescription className="text-black font-bold text-3xl">
                Create Account
              </CardDescription>
              <CardDescription className="text-md pt-2">
                Join us today!
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="max-h-[250px] overflow-y-auto space-y-4">
            {[
              { id: "userName", label: "Full Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "contactNumber", label: "Phone Number", type: "text" },
              { id: "address", label: "Address", type: "text" },
              { id: "password", label: "Password", type: "password" },
              { id: "confirmPassword", label: "Confirm Password", type: "password" },
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
          </CardContent>

          <CardFooter className="grid w-full items-center gap-4">
            <Button type="submit" className="bg-green-600" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <div className="text-center">
              <CardDescription className="text-sm pt-2">
                Already have an account?{" "}
                <a href="/login" className="text-green-600 font-bold">
                  Login
                </a>
              </CardDescription>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Register;
