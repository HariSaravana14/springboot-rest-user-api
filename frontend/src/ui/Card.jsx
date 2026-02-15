import { motion } from "framer-motion";

export const Card = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`glass-morphism p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export const GlassCard = ({ children, className = "" }) => (
    <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className={`relative glass-morphism p-6 ${className}`}>
            {children}
        </div>
    </div>
);
