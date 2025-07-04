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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authApi";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation(
    (role) => {
      navigate("/dashboard");
      toast.success("Login successful!");
    },
    (message) => {
      setErrorMsg(message);
      toast.error(message);
    }
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      setErrorMsg("");
      loginMutation.mutate(values);
    },
  });

  return (
    <div className="bg-[#e6f8f4] min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <img src={Logo} alt="EvoMo Logo" className="w-8 h-8" />
            <CardTitle className="font-bold text-xl">EvoMo</CardTitle>
          </div>
          <div className="text-center">
            <CardDescription className="text-black font-bold text-3xl">
              Welcome Back
            </CardDescription>
            <CardDescription className="text-md pt-2">
              Sign in to your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.password}
                  </p>
                )}
              </div>
              {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
            </div>

            <CardFooter className="grid w-full items-center gap-4 mt-6">
              <Button
                className="bg-green-600"
                type="submit"
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center">
                <CardDescription className="text-sm pt-2">
                  Don’t have an account?{" "}
                  <a href="/register" className="text-green-600 font-bold">
                    Register
                  </a>
                </CardDescription>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
