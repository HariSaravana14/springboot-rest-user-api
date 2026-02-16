import React, { useEffect, useState } from "react";
import { getTasksByUser, updateTaskStatus } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    Clock,
    ListChecks
} from "lucide-react";

const MyTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusError, setStatusError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        if (!user) return;
        try {
            const res = await getTasksByUser(user.id);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            setStatusError(null);
            await updateTaskStatus(taskId, newStatus);
            fetchTasks();
        } catch (err) {
            const messageFromApi = err?.response?.data?.message;
            const messageFromErrors = err?.response?.data?.errors
                ? JSON.stringify(err.response.data.errors)
                : null;
            const fallback = err?.message || "Failed to update task status";

            const message = messageFromApi || messageFromErrors || fallback;
            setStatusError(message);
            console.error("Failed to update task status:", err?.response?.data || err);
        }
    };

    const stats = [
        { label: "Total", value: tasks.length, icon: <ListChecks size={16} /> },
        { label: "In progress", value: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: <Clock size={16} /> },
        { label: "Done", value: tasks.filter(t => t.status === 'DONE').length, icon: <CheckCircle size={16} /> },
    ];

    const statusBadge = (status) => {
        if (status === 'DONE') return "bg-emerald-50 text-emerald-700 border border-emerald-200";
        if (status === 'IN_PROGRESS') return "bg-amber-50 text-amber-700 border border-amber-200";
        return "bg-slate-50 text-slate-700 border border-slate-200";
    };

    return (
        <div className="space-y-8">
            <header className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">My Tasks</h1>
                <p className="text-[var(--text-muted)]">Tasks currently assigned to {user?.name}.</p>
            </header>

            {statusError && (
                <div className="glass-panel p-4 border border-rose-200 bg-rose-50 text-rose-800">
                    <div className="text-sm font-medium">Couldn’t update task status</div>
                    <div className="text-sm mt-1 break-words">{statusError}</div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-panel p-5"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                            <div className="text-[var(--text-muted)]">{stat.icon}</div>
                        </div>
                        <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">Task list</h2>
                    <span className="text-sm text-[var(--text-muted)]">{tasks.length} total</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin w-10 h-10 border-4 border-[var(--border-color)] border-t-[var(--accent)] rounded-full" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="glass-panel p-10 text-center">
                        <p className="text-[var(--text-muted)]">No tasks assigned right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="glass-card p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {task.projectTitle && (
                                                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                                                        {task.projectTitle}
                                                    </span>
                                                )}
                                                <span className={`text-xs px-2.5 py-1 rounded-lg ${statusBadge(task.status)}`}>
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-semibold text-[var(--foreground)] truncate">{task.title}</h3>
                                        </div>
                                    </div>

                                    <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-3">
                                        {task.description || "No description provided."}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
                                        <div className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            {task.status === 'TODO' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(task.id, 'IN_PROGRESS')}
                                                    className="btn-secondary"
                                                >
                                                    Start
                                                </button>
                                            )}
                                            {task.status !== 'DONE' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(task.id, 'DONE')}
                                                    className="btn-primary"
                                                >
                                                    Mark done
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MyTasks;
