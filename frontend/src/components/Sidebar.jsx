import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    Kanban,
    Users,
    Shield,
    LogOut,
    Sun,
    Moon,
    Menu,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = user?.role === 'ADMIN'
        ? [{ name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" }]
        : [
            { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
            { name: "Projects", icon: <Kanban size={18} />, path: "/projects" },
        ];

    const adminItems = [
        { name: "Projects", icon: <Kanban size={18} />, path: "/admin/projects" },
        { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
        { name: "Stats", icon: <Shield size={18} />, path: "/admin/stats" },
    ];

    if (!user) return null;

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : -288, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:flex fixed top-0 left-0 h-full w-72 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] z-[50] flex-col"
            >
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={toggleSidebar}>
                        <div className="w-9 h-9 bg-[var(--accent)] rounded-lg flex items-center justify-center shrink-0">
                            <Kanban className="text-white" size={18} />
                        </div>
                        <span className="text-lg font-bold text-[var(--foreground)]">ProManager</span>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
                        <div>
                            <p className="px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">Workspace</p>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                                    >
                                        {item.icon}
                                        <span className="text-sm">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {user.role === 'ADMIN' && (
                            <div>
                                <p className="px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">Admin</p>
                                <nav className="space-y-1">
                                    {adminItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`sidebar-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                                        >
                                            {item.icon}
                                            <span className="text-sm">{item.name}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-[var(--accent-weak)] flex items-center justify-center font-semibold text-[var(--accent)] text-sm shrink-0">
                                {user?.name?.[0] || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--foreground)] truncate">{user.name}</p>
                                <p className="text-xs text-[var(--text-muted)] truncate">{user.role}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-center p-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-weak)] transition-colors"
                            >
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <button
                                onClick={() => { logout(); navigate("/login"); }}
                                className="flex items-center justify-center p-2.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Desktop Re-open Trigger */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        onClick={toggleSidebar}
                        className="hidden lg:flex fixed top-6 left-6 z-[60] w-10 h-10 bg-[var(--accent)] rounded-lg items-center justify-center text-white shadow-md transition-colors"
                    >
                        <Menu size={18} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Mobile Toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-[100] p-2.5 rounded-lg bg-[var(--accent)] text-white shadow-md"
            >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSidebar}
                            className="fixed inset-0 bg-black/40 z-[80]"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-72 bg-[var(--sidebar-bg)] z-[90] shadow-xl"
                        >
                            <div className="flex flex-col h-full p-6 pt-16">
                                <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
                                    <div>
                                        <p className="px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">Workspace</p>
                                        <nav className="space-y-1">
                                            {menuItems.map((item) => (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={toggleSidebar}
                                                    className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                                                >
                                                    {item.icon}
                                                    <span className="text-sm">{item.name}</span>
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                    {user.role === 'ADMIN' && (
                                        <div>
                                            <p className="px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-2">Admin</p>
                                            <nav className="space-y-1">
                                                {adminItems.map((item) => (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        onClick={toggleSidebar}
                                                        className={`sidebar-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                                                    >
                                                        {item.icon}
                                                        <span className="text-sm">{item.name}</span>
                                                    </Link>
                                                ))}
                                            </nav>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
                                    <button
                                        onClick={() => { logout(); navigate("/login"); }}
                                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500 text-white font-medium text-sm"
                                    >
                                        <LogOut size={16} /> Log Out
                                    </button>
                                </div>
                            </div>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
