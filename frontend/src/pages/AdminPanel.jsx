import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllProjects,
    getAllUsers,
    createProject,
    createTask,
    deleteProject
} from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Users,
    Kanban,
    Trash2,
    FilePlus,
    Activity,
    Box,
    ChevronRight,
} from "lucide-react";

const AdminPanel = ({ activeTab: initialTab = "projects" }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newProject, setNewProject] = useState({ title: "", description: "" });
    const [newTask, setNewTask] = useState({ title: "", description: "", projectId: "", assignedUserId: "", dueDate: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pRes, uRes] = await Promise.all([getAllProjects(), getAllUsers()]);
            setProjects(pRes.data);
            setUsers(uRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await createProject(newProject);
            setNewProject({ title: "", description: "" });
            fetchData();
        } catch (err) { alert("Provisioning failed."); }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask(newTask);
            setNewTask({ title: "", description: "", projectId: "", assignedUserId: "", dueDate: "" });
            fetchData();
        } catch (err) { alert("Injection failed."); }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm("Confirm deconstruction?")) {
            await deleteProject(id);
            fetchData();
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">Admin</h1>
                    <p className="text-[var(--text-muted)]">Manage projects and users.</p>
                </div>

                <div className="glass-panel p-1 flex items-center gap-1 w-full sm:w-auto">
                    {[
                        { id: 'projects', label: 'Projects', icon: <Box size={16} /> },
                        { id: 'users', label: 'Users', icon: <Users size={16} /> },
                        { id: 'stats', label: 'Stats', icon: <Activity size={16} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'} flex-1 sm:flex-none px-4 py-2 rounded-xl`}
                        >
                            <span className="inline-flex items-center justify-center gap-2">
                                {tab.icon} {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'projects' && (
                    <motion.div
                        key="projects"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="glass-panel p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                                        <FilePlus size={18} /> New project
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)]">Create a new project.</p>
                                </div>
                                <form onSubmit={handleCreateProject} className="space-y-6">
                                    <input
                                        type="text"
                                        placeholder="Project title"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Description (optional)"
                                        className="h-28"
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                    <button type="submit" className="btn-primary w-full">
                                        <Plus size={18} /> Create project
                                    </button>
                                </form>
                            </div>

                            <div className="glass-panel p-6 space-y-4 h-fit">
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                                        <Kanban size={18} /> New task
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)]">Create a task and assign it to a user.</p>
                                </div>
                                <form onSubmit={handleCreateTask} className="space-y-5">
                                    <select
                                        value={newTask.projectId}
                                        onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                                        required
                                    >
                                        <option value="">Project</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                    </select>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Task title"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            required
                                        />
                                        <select
                                            value={newTask.assignedUserId}
                                            onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
                                            required
                                        >
                                            <option value="">Assignee</option>
                                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                    </div>

                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        required
                                    />

                                    <button type="submit" className="btn-primary w-full">
                                        <Plus size={18} /> Create task
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[var(--foreground)] flex items-center gap-2">
                                    <Activity size={18} /> Projects
                                </h3>
                                <span className="text-sm text-[var(--text-muted)]">{projects.length} total</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {projects.map(p => (
                                    <div
                                        key={p.id}
                                        className="glass-panel p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                        onClick={() => navigate(`/project/${p.id}`)}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-[var(--foreground)] truncate">{p.title}</h4>
                                                <p className="text-sm text-[var(--text-muted)] truncate">Owner: {p.ownerName}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteProject(p.id);
                                                }}
                                                className="btn-ghost p-2"
                                                title="Delete project"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-sm text-[var(--text-muted)]">
                                            <span>{p.taskCount} tasks</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div
                        key="users"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                        {users.map(u => (
                            <div key={u.id} className="glass-panel p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg border border-[var(--border-color)] bg-[var(--accent-weak)] text-[var(--accent)]">
                                    {u.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-[var(--foreground)] truncate">{u.name}</h4>
                                    <p className="text-sm text-[var(--text-muted)] truncate">{u.email}</p>
                                    <div className="mt-4">
                                        <span className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)]">
                                            {u.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'stats' && (
                    <motion.div
                        key="stats"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-10 text-center space-y-3"
                    >
                        <div>
                            <p className="text-lg font-semibold text-[var(--foreground)]">Stats</p>
                            <p className="text-[var(--text-muted)]">No additional metrics configured yet.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPanel;
