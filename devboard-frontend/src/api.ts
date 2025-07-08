// src/api.ts (或你定义 axios 实例的文件)
import axios from "axios";

const instance = axios.create({
    baseURL: "/api",
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log(" Axios Request - Authorization header:", token ? `Bearer ${token}` : "No token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
