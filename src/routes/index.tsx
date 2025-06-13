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
      | "team-member") || "guest";

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
                    <MainLayout role={role}>
                      <DashboardScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="events"
                  element={
                    <MainLayout role={role}>
                      <EventsScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="events/:eventId/edit"
                  element={
                    <MainLayout role={role}>
                      <EventEditScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="tasks"
                  element={
                    <MainLayout role={role}>
                      <TasksScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="inventory"
                  element={
                    <MainLayout role={role}>
                      <InventoryScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="team"
                  element={
                    <MainLayout role={role}>
                      <TeamScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="budget"
                  element={
                    <MainLayout role={role}>
                      <BudgetScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="calendar"
                  element={
                    <MainLayout role={role}>
                      <CalendarScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <MainLayout role={role}>
                      <ReportScreen />
                    </MainLayout>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <MainLayout role={role}>
                      <ProfileScreen />
                    </MainLayout>
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