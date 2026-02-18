import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, getTasksByProject, updateTaskStatus, deleteProject, createTask, getAllUsers } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    Calendar,
    ChevronLeft,
    Trash2,
    Users,
    Circle,
    Plus,
    X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", assignedUserId: "", dueDate: "" });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [projRes, tasksRes, usersRes] = await Promise.all([
                getProjectById(id),
                getTasksByProject(id),
                isAdmin() ? getAllUsers() : Promise.resolve({ data: [] })
            ]);
            setProject(projRes.data);
            setTasks(tasksRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed status check.");
        }
    };

    const handleDeleteProject = async () => {
        if (window.confirm("Permanently deconstruct this project architecture?")) {
            await deleteProject(id);
            navigate("/dashboard");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask({ ...newTask, projectId: id, status: "TODO" });
            setShowCreateModal(false);
            setNewTask({ title: "", description: "", assignedUserId: "", dueDate: "" });
            fetchData();
        } catch (err) {
            alert("Failed to create task.");
        }
    };

    const columns = [
        { id: "TODO", label: "To do" },
        { id: "IN_PROGRESS", label: "In progress" },
        { id: "DONE", label: "Done" },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 pb-8">
            <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
                <div className="space-y-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-ghost px-0"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">{project?.title}</h1>
                    {project?.description && (
                        <p className="text-[var(--text-muted)] max-w-3xl">{project.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)] mt-2">
                        <span className="inline-flex items-center gap-2">
                            <Users size={16} /> {project?.ownerName || "Unassigned"}
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Circle size={16} /> {tasks.length} tasks
                        </span>
                    </div>
                </div>

                {isAdmin() && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary"
                        >
                            <Plus size={18} /> Add Task
                        </button>
                        <button onClick={handleDeleteProject} className="btn-secondary text-red-600">
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </header>

            {/* Create Task Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                                <h3 className="font-semibold text-[var(--foreground)]">New Task</h3>
                                <button onClick={() => setShowCreateModal(false)} className="btn-ghost p-1">
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateTask} className="p-4 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Task title"
                                    className="w-full"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                    autoFocus
                                />
                                <textarea
                                    placeholder="Description"
                                    className="w-full h-24 resize-none"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex gap-2">
                                            <select
                                                className="w-full"
                                                value={newTask.assignedUserId}
                                                onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
                                            >
                                                <option value="">Unassigned</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setNewTask({ ...newTask, assignedUserId: user?.id || "" })}
                                            className="text-xs text-[var(--accent)] hover:underline"
                                        >
                                            Assign to me
                                        </button>
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full h-[42px]"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn-ghost">Cancel</button>
                                    <button type="submit" className="btn-primary">Create Task</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                {columns.map((col) => (
                    <div key={col.id} className="space-y-3">
                        <div className="glass-panel p-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[var(--foreground)]">{col.label}</h2>
                            <span className="text-xs px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                                {tasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>

                        <div className="space-y-3 min-h-[240px]">
                            <AnimatePresence mode="popLayout">
                                {tasks.filter(t => t.status === col.id).map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="glass-card p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h4 className="font-semibold text-[var(--foreground)]">{task.title}</h4>
                                            <span className="text-xs text-[var(--text-muted)]">#{task.id}</span>
                                        </div>

                                        <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-3">
                                            {task.description || "No description provided."}
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {task.dueDate && (
                                                <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                                                    <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                            {task.assignedUserName && (
                                                <div className="relative group/user">
                                                    <span className="cursor-help inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors">
                                                        <Users size={14} /> {task.assignedUserName}
                                                    </span>
                                                    {/* Hover Card */}
                                                    <div className="absolute bottom-full left-0 mb-2 w-56 p-3 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 z-10 transform translate-y-2 group-hover/user:translate-y-0">
                                                        <div className="text-xs font-semibold text-slate-800 mb-2 pb-1 border-b border-slate-100">Assigned User Details</div>
                                                        <div className="flex items-start gap-3 mb-2">
                                                            <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                                {task.assignedUserName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-700">{task.assignedUserName}</div>
                                                                <div className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">
                                                                    {task.assignedUserRole?.replace('ROLE_', '').toLowerCase() || 'Member'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 flex items-center gap-1.5 break-all">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                            {task.assignedUserEmail || "No email"}
                                                        </div>
                                                        <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-white border-b border-r border-slate-100 transform rotate-45"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                                            <label className="text-xs text-[var(--text-muted)]">Move to</label>
                                            <select
                                                className="mt-1"
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            >
                                                {columns.map(c => (
                                                    <option key={c.id} value={c.id}>{c.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[var(--accent-weak)] text-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">No tasks yet</h3>
                    <p className="text-[var(--text-muted)] max-w-sm mx-auto mt-1 mb-6">
                        Get started by adding tasks to this project. Assign them to team members to track progress.
                    </p>
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                        <Plus size={18} /> Create first task
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
