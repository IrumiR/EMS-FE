import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardScreen from "../pages/dashboard";
import MainLayout from "../layout/main-layout";
import EventsScreen from "@/pages/events";


const role: "admin" | "client" | "manager" | "member" = "admin";

const AppRoutes = () => (
  <Router>
    <MainLayout role={role}>
      <Routes>
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/events" element={<EventsScreen />} />
      </Routes>
    </MainLayout>
  </Router>
);

export default AppRoutes;
