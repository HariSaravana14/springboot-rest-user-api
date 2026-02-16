import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectDetails from "./pages/ProjectDetails";
import DashboardRouter from "./pages/DashboardRouter";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Entry */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Optional public landing */}
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Workspace */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Task management dashboard */}
                <Route path="/dashboard" element={<DashboardRouter />} />

                {/* Projects */}
                <Route path="/projects" element={<Dashboard />} />
                <Route path="/project/:id" element={<ProjectDetails />} />

                {/* Admin Management Routes */}
                <Route element={<ProtectedRoute adminOnly={true} />}>
                  <Route path="/admin" element={<Navigate to="/admin/projects" replace />} />
                  <Route path="/admin/projects" element={<AdminPanel activeTab="projects" />} />
                  <Route path="/admin/users" element={<AdminPanel activeTab="users" />} />
                  <Route path="/admin/stats" element={<AdminPanel activeTab="stats" />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
