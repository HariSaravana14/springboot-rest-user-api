import axios from "axios";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8080";

const API = axios.create({
    baseURL: BASE_URL,
});

// Interceptor to attach JWT token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// Users API
export const getUsers = () => API.get("/api/users");
export const getAllUsers = getUsers; // Alias
export const createUser = (data) => API.post("/auth/register", data); // Reuses register
export const updateUser = (id, data) => API.put(`/api/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/api/users/${id}`);

// Projects API
export const getAllProjects = () => API.get("/api/projects");
export const getProjectById = (id) => API.get(`/api/projects/${id}`);
export const createProject = (data) => API.post("/api/projects", data);
export const updateProject = (id, data) => API.put(`/api/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/api/projects/${id}`);

// Tasks API
export const getTasksByProject = (projectId) => API.get(`/api/tasks/project/${projectId}`);
export const createTask = (data) => API.post("/api/tasks", data);
export const updateTask = (id, data) => API.put(`/api/tasks/${id}`, data);
export const updateTaskStatus = (id, status) => API.patch(`/api/tasks/${id}/status`, { status });
export const getTasksByUser = (userId) => API.get(`/api/tasks/user/${userId}`);
export const deleteTask = (id) => API.delete(`/api/tasks/${id}`);

export default API;
