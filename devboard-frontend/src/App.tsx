import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import api from "./api";
import type { Task } from "./types";

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [reload, setReload] = useState(false);

    const triggerReload = () => setReload((prev) => !prev);

    useEffect(() => {
        setLoading(true);
        api.get("/tasks")
            .then((res) => {
                setTasks(res.data);
                setError("");
            })
            .catch((err) => {
                console.error("Failed to fetch tasks:", err);
                setError("Failed to fetch tasks.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [reload]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center px-4 py-10">
            <div className="w-full max-w-xl space-y-6">
                <h1 className="text-3xl font-bold text-center text-blue-600">
                    DevBoard Task Manager
                </h1>
                <TaskForm onTaskCreated={triggerReload} />
                <TaskList tasks={tasks} loading={loading} error={error} onDelete={triggerReload} />
            </div>
        </div>
    );
}
