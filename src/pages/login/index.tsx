import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import Logo from "@/assets/svg/sidebar-logo.svg"


function Login() {
  return (
    <div className="bg-[#e6f8f4] min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
        <img src={Logo} alt="EvoMo Logo" className="w-8 h-8" />
        <CardTitle className="font-bold text-xl">EvoMo</CardTitle>
        </div>
       <div className="text-center">
       <CardDescription className="text-black font-bold text-3xl">Welcome Back</CardDescription>
       <CardDescription className="text-md pt-2">Sign in to your account</CardDescription>
       </div>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Email" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="grid w-full items-center gap-4">
        <Button className="bg-green-600">Login</Button>
       <div className="text-center">
       <CardDescription className="text-sm pt-2">Don`t have an account? {" "}
       <a href="/register" className="text-green-600 font-bold">Register</a></CardDescription>
       </div>
      </CardFooter>
    </Card>
    </div>
  );
}

export default Login;