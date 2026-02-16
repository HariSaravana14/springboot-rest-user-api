import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, getTasksByProject, updateTaskStatus, deleteProject } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    Calendar,
    ChevronLeft,
    Trash2,
    Users,
    Circle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            const [projRes, tasksRes] = await Promise.all([
                getProjectById(id),
                getTasksByProject(id)
            ]);
            setProject(projRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            fetchProjectData();
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
                    <button onClick={handleDeleteProject} className="btn-secondary text-red-600">
                        <Trash2 size={16} /> Delete project
                    </button>
                )}
            </header>

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
                                                <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                                                    <Users size={14} /> {task.assignedUserName}
                                                </span>
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
        </div>
    );
};

export default ProjectDetails;
