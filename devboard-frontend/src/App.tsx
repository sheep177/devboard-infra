import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import api from "./api";
import "./App.css";
import type {Task} from "./types";

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
    }, []);

    const addTask = (task: Task) => {
        setTasks((prev) => [...prev, task]);
    };

    return (
        <div className="container">
            <h1>DevBoard Task Manager</h1>
            <TaskForm onTaskCreated={addTask} />
            <TaskList tasks={tasks} loading={loading} error={error} />
        </div>
    );
}

export default App;
