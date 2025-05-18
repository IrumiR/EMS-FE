import { Lock } from "lucide-react";

const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center px-4">
    <Lock className="w-16 h-16 text-red-500 mb-6" />
    <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
    <p className="text-lg text-gray-600">
      You do not have permission to view this page.
    </p>
  </div>
);

export default Unauthorized;