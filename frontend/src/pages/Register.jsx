import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { registerUser, loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Shield, Kanban } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });
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
            await registerUser(formData);
            const loginRes = await loginUser({ email: formData.email, password: formData.password });
            login(loginRes.data);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel w-full max-w-xl p-8"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-[var(--accent)] rounded-xl flex items-center justify-center text-white mx-auto mb-5">
                        <Kanban size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
                        Create Account
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm">Get started for free</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--text-muted)]">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={16} />
                                <input
                                    placeholder="John Doe"
                                    className="pl-12"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--text-muted)]">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={16} />
                                <select
                                    className="pl-12 appearance-none cursor-pointer"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

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
                                placeholder="Create a password"
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
                                <UserPlus size={18} />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-[var(--text-muted)] text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-[var(--accent)]">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
