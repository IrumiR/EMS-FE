import { Navigate } from "react-router-dom";

const validRoles = ["admin", "client", "manager", "team-member"] as const;

type Role = (typeof validRoles)[number];

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[]; // Optional: if not passed, only checks for valid role
}) => {
  const role = localStorage.getItem("role") as Role | null;

  if (!role || !validRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If allowedRoles are provided, check access
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
