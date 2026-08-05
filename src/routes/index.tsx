import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardScreen from "../pages/dashboard";
import MainLayout from "../layout/main-layout";
import EventsScreen from "@/pages/events";
import EventEditScreen from "@/pages/events/eventEditScreen";
import BudgetScreen from "@/pages/budget";
import CalendarScreen from "@/pages/calendar";
import Login from "@/pages/login";
import Register from "@/pages/register";
import TasksScreen from "@/pages/tasks";
import InventoryScreen from "@/pages/inventory";
import { Toaster } from "react-hot-toast";
import TeamScreen from "@/pages/team";
import ProtectedRoute from "./ProtectedRoutes";
import Unauthorized from "@/pages/unauthorized";
import ProfileScreen from "@/pages/profile";
import ReportScreen from "@/pages/reports";

const AppRoutes = () => {
  const role =
    (localStorage.getItem("role") as
      | "admin"
      | "client"
      | "manager"
      | "team-member");

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member", "client"]}>
                      <MainLayout role={role}>
                        <DashboardScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="events"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member", "client"]}>
                      <MainLayout role={role}>
                        <EventsScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="events/:eventId/edit"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member", "client"]}>
                    <MainLayout role={role}>
                      <EventEditScreen />
                    </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="tasks"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member"]}>
                      <MainLayout role={role}>
                        <TasksScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="inventory"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member"]}>
                      <MainLayout role={role}>
                        <InventoryScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="reservations"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member"]}>
                      <MainLayout role={role}>
                        <ReservationScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                /> */}
                <Route
                  path="team"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member"]}>
                      <MainLayout role={role}>
                        <TeamScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="budget"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "client"]}>
                      <MainLayout role={role}>
                        <BudgetScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="calendar"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member", "client"]}>
                      <MainLayout role={role}>
                        <CalendarScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <MainLayout role={role}>
                        <ReportScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="profile"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "team-member", "client"]}>
                      <MainLayout role={role}>
                        <ProfileScreen />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;