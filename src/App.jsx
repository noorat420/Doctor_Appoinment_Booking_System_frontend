import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Patient Pages
import DoctorsList from "./pages/patient/DoctorsList";
import MyAppointments from "./pages/patient/MyAppointments";

// Doctor Pages
import DoctorAppointments from "./pages/doctor/Appointments";
import ManageSlots from "./pages/doctor/ManageSlots";
import DoctorProfile from "./pages/doctor/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRole="patient">
              <DashboardLayout>
                <DoctorsList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRole="patient">
              <DashboardLayout>
                <MyAppointments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Redirect /patient to /patient/doctors */}
        <Route
          path="/patient"
          element={<Navigate to="/patient/doctors" replace />}
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DashboardLayout>
                <DoctorAppointments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/availability"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DashboardLayout>
                <ManageSlots />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DashboardLayout>
                <DoctorProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Redirect /doctor to /doctor/appointments */}
        <Route
          path="/doctor"
          element={<Navigate to="/doctor/appointments" replace />}
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
