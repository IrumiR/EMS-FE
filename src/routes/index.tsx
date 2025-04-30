import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardScreen from "../pages/dashboard";
import MainLayout from "../layout/main-layout";
import EventsScreen from "@/pages/events";
import Login from "@/pages/login";
import Register from "@/pages/register";
import TasksScreen from "@/pages/tasks";
import InventoryScreen from "@/pages/inventory";
import { Toaster } from "react-hot-toast";

const role: "admin" | "client" | "manager" | "team-member" = "admin";

const AppRoutes = () => (
  <Router>
    <Toaster position="top-center" />
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <MainLayout role={role}>
            <DashboardScreen />
          </MainLayout>
        }
      />
      <Route
        path="/events"
        element={
          <MainLayout role={role}>
            <EventsScreen />
          </MainLayout>
        }
      />

      <Route
        path="/tasks"
        element={
          <MainLayout role={role}>
            <TasksScreen />
          </MainLayout>
        }
      />
      <Route
        path="/inventory"
        element={
          <MainLayout role={role}>
            <InventoryScreen />
          </MainLayout>
        }
      />
    </Routes>
  </Router>
);

export default AppRoutes;
