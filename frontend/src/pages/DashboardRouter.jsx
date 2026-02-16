import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MyTasks from "./MyTasks";
import AdminDashboard from "./AdminDashboard";

const DashboardRouter = () => {
  const { isAdmin } = useAuth();

  if (isAdmin()) {
    return <AdminDashboard />;
  }

  return <MyTasks />;
};

export default DashboardRouter;
