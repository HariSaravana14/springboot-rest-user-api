import { useState, useEffect } from "react";
import { User, Mail, Plus, Check, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { motion, AnimatePresence } from "framer-motion";

function UserForm({ onSubmit, editingUser, clearEdit }) {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    if (editingUser) {
      setUser(editingUser);
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.email) return;
    onSubmit(user);
    setUser({ name: "", email: "" });
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            icon={User}
            value={user.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="john@example.com"
            icon={Mail}
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" className="w-full md:w-auto min-w-[140px]">
            {editingUser ? (
              <>
                <Check size={18} />
                Update User
              </>
            ) : (
              <>
                <Plus size={18} />
                Add User
              </>
            )}
          </Button>

          <AnimatePresence>
            {editingUser && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <Button
                  variant="ghost"
                  onClick={clearEdit}
                  className="w-full md:w-auto"
                >
                  <X size={18} />
                  Cancel
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Card>
  );
}

export default UserForm;
