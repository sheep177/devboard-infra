import { createContext, useContext, useState, useEffect } from "react";
import type { Task } from "../types";
import api from "../api";

interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    fetchTasks: () => Promise<void>;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, loading, fetchTasks, setTasks }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) throw new Error("useTasks must be used within TaskProvider");
    return context;
}
