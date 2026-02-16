import { useEffect, useState } from "react";
import { getAllProjects } from "../api/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, Plus, LayoutGrid, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await getAllProjects();
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[var(--accent)] text-xs font-semibold uppercase tracking-wide mb-2">
                        <LayoutGrid size={14} /> Dashboard
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--foreground)]">
                        Projects
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1">
                        Manage and track all your projects in one place.
                    </p>
                </div>

                {isAdmin() && (
                    <Link to="/admin/projects" className="btn-premium whitespace-nowrap">
                        <Plus size={18} /> New Project
                    </Link>
                )}
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-panel h-52 animate-pulse opacity-30" />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="glass-panel p-16 text-center">
                    <Folder size={40} className="mx-auto text-[var(--text-muted)] opacity-30 mb-4" />
                    <p className="text-[var(--text-muted)]">No projects yet. Create one to get started.</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {projects.map((project) => (
                        <Link key={project.id} to={`/project/${project.id}`} className="group">
                            <div className="glass-card h-full p-6 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-[var(--accent-weak)] rounded-lg flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                        <Folder size={20} />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[var(--accent-weak)] flex items-center justify-center text-xs font-semibold text-[var(--accent)]">
                                        {project.ownerName?.[0] || "U"}
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 line-clamp-2">
                                    {project.description || "No description provided."}
                                </p>

                                <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-sm text-[var(--text-muted)]">
                                    <span>{project.taskCount} Tasks</span>
                                    <span className="group-hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                                        View <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
