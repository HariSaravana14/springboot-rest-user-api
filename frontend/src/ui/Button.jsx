import { motion } from "framer-motion";

export const Button = ({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) => {
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        danger: "btn-danger",
        ghost: "btn-ghost"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${variants[variant]} ${className}`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};
