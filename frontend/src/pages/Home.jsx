import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/api";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import { motion } from "framer-motion";
import { Users, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

function Home() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (user) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, user);
        setEditingUser(null);
      } else {
        await createUser(user);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
      }
      fetchUsers();
    } catch (error) {
      console.error("Operation failed", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Users className="text-indigo-400" size={24} />
              </div>
              {/* <span className="text-sm font-bold tracking-widest text-indigo-400 uppercase">
                Admin Dashboard
              </span> */}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              User <span className="gradient-text">Management</span>
            </h1>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5"
          >
            <div className="px-6 py-3">
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Total Users</div>
            </div>
            <div className="w-px h-8 bg-white/5"></div>
            <div className="pr-4 pl-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles size={18} />
              </div>
            </div>
          </motion.div>
        </header>

        <main className="space-y-12">
          {/* Form Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                {editingUser ? 'Edit User Details' : 'Create New User'}
                <span className="h-1 w-12 bg-indigo-500 rounded-full"></span>
              </h2>
              <UserForm
                onSubmit={handleSubmit}
                editingUser={editingUser}
                clearEdit={() => setEditingUser(null)}
              />
            </motion.div>
          </section>

          {/* List Section */}
          <section className="pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  User Directory
                  <span className="h-1 w-12 bg-purple-500 rounded-full"></span>
                </h2>
                {loading && (
                  <div className="flex items-center gap-2 text-indigo-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-400 border-t-transparent"></div>
                    <span className="text-sm font-medium">Syncing...</span>
                  </div>
                )}
              </div>

              <UserList
                users={users}
                onEdit={(user) => setEditingUser(user)}
                onDelete={handleDelete}
              />
            </motion.div>
          </section>
        </main>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}

export default Home;
