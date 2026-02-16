import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            if (savedUser && token && savedUser !== "undefined") {
                setUser(JSON.parse(savedUser));
            }
        } catch (err) {
            console.error("Failed to restore session:", err);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (authData) => {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify({
            id: authData.userId,
            name: authData.name,
            email: authData.email,
            role: authData.role
        }));
        setUser({
            id: authData.userId,
            name: authData.name,
            email: authData.email,
            role: authData.role
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const isAdmin = () => user?.role === "ADMIN";

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
