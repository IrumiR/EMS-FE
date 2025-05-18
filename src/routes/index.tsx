import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardScreen from "../pages/dashboard";
import MainLayout from "../layout/main-layout";
import EventsScreen from "@/pages/events";
import EventDetailedScreen from "@/pages/events/eventDetailedScreen";
import EventEditScreen from "@/pages/events/eventEditScreen";
import Login from "@/pages/login";
import Register from "@/pages/register";
import TasksScreen from "@/pages/tasks";
import InventoryScreen from "@/pages/inventory";
import { Toaster } from "react-hot-toast";
import TeamScreen from "@/pages/team";
import ProtectedRoute from "./ProtectedRoutes";
import Unauthorized from "@/pages/unauthorized";

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
                  path="events/:eventId"
                  element={
                    <MainLayout role={role}>
                      <EventDetailedScreen />
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
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;