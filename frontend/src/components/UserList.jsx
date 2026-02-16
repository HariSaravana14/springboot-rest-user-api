import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Mail, User as UserIcon } from "lucide-react";
import { Button } from "../ui/Button";

function UserList({ users, onEdit, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 glass-panel">
        <p className="text-[var(--text-muted)]">No users found. Add some to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative"
          >
            <div className="relative glass-panel p-6 flex flex-col h-full">
              <div className="flex flex-row justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-weak)] flex items-center justify-center text-[var(--accent)] border border-[var(--border-color)] shrink-0">
                  <UserIcon size={24} />
                </div>
                <div className="flex flex-row gap-1">
                  <Button
                    variant="ghost"
                    className="p-2 min-w-0 rounded-lg hover:bg-yellow-500/10 hover:text-yellow-500"
                    onClick={() => onEdit(user)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    className="p-2 min-w-0 rounded-lg hover:bg-red-500/10 hover:text-red-500"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>


              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                {user.name}
              </h3>

              <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mt-auto">
                <Mail size={14} />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-xs text-[var(--text-muted)]">
                <span>ID: {user.id}</span>
                <span className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">Active</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default UserList;
