import { motion } from "framer-motion";

export const Input = ({ label, icon: Icon, ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-medium text-slate-400 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 ${Icon ? 'pl-11' : ''} text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300`}
                />
            </div>
        </div>
    );
};
