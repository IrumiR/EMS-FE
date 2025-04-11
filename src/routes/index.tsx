import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardScreen from "../pages/dashboard";
import MainLayout from "../layout/main-layout";
import EventsScreen from "@/pages/events";
import Login from "@/pages/login";
import Register from "@/pages/register";

const role: "admin" | "client" | "manager" | "member" = "admin";

const AppRoutes = () => (
  <Router>
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
    </Routes>
  </Router>
);

export default AppRoutes;
