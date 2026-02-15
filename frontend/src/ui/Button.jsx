import { motion } from "framer-motion";

export const Button = ({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) => {
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        danger: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
        ghost: "bg-transparent text-slate-400 hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`relative overflow-hidden rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className || (variant === 'ghost' ? 'p-2' : 'px-6 py-2.5')} ${variants[variant]}`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};
