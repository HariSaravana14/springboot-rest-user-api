import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Kanban } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/dashboard";

    if (user) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await loginUser(formData);
            login(res.data);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel w-full max-w-md p-8"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-[var(--accent)] rounded-xl flex items-center justify-center text-white mx-auto mb-5">
                        <Kanban size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
                        Sign In
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm">Welcome back to ProManager</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-6 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--text-muted)]">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={16} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="pl-12"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--text-muted)]">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={16} />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="pl-12"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-premium w-full mt-2">
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-[var(--text-muted)] text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-[var(--accent)]">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
