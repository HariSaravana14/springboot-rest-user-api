import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Kanban, ArrowRight } from "lucide-react";

const LandingPage = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg"
            >
                <div className="w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Kanban className="text-white" size={28} />
                </div>

                <h1 className="text-4xl font-bold text-[var(--foreground)] mb-3 tracking-tight">
                    ProManager
                </h1>
                <p className="text-[var(--text-muted)] text-lg mb-10">
                    Simple project management for teams.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-8 py-3 rounded-xl border border-[var(--border-color)] text-[var(--foreground)] font-medium hover:border-[var(--accent)] transition-colors text-center"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="btn-premium w-full sm:w-auto px-8 py-3"
                    >
                        Get Started <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
