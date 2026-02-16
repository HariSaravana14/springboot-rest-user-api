import { motion } from "framer-motion";

export const Input = ({ label, icon: Icon, ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-medium text-[var(--text-muted)] ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--foreground)] transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    {...props}
                    className={`${Icon ? 'pl-11' : ''}`}
                />
            </div>
        </div>
    );
};
