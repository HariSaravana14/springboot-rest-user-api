import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProjects, getAllUsers } from "../api/api";
import { FolderKanban, Users, ListChecks } from "lucide-react";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, uRes] = await Promise.all([getAllProjects(), getAllUsers()]);
        setProjects(pRes.data || []);
        setUsers(uRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalTasks = useMemo(() => {
    return (projects || []).reduce((sum, project) => sum + (project?.taskCount || 0), 0);
  }, [projects]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Admin Dashboard</h1>
        <p className="text-[var(--text-muted)]">Overview of projects, users, and task volume.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-10 h-10 border-4 border-[var(--border-color)] border-t-[var(--accent)] rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text-muted)]">Projects</p>
                <FolderKanban size={18} className="text-[var(--text-muted)]" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{projects.length}</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text-muted)]">Users</p>
                <Users size={18} className="text-[var(--text-muted)]" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{users.length}</p>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text-muted)]">Total tasks</p>
                <ListChecks size={18} className="text-[var(--text-muted)]" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{totalTasks}</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[var(--foreground)] font-semibold">Quick actions</p>
              <p className="text-sm text-[var(--text-muted)]">Jump to admin management screens.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link to="/admin/projects" className="btn-primary w-full sm:w-auto">Manage projects</Link>
              <Link to="/admin/users" className="btn-secondary w-full sm:w-auto">Manage users</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
