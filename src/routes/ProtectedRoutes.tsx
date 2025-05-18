import { Navigate } from "react-router-dom";

const validRoles = ["admin", "client", "manager", "team-member"];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem("role");

  if (!role || !validRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;