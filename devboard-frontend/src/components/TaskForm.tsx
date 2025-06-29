import { useState } from "react";
import api from "../api";
import type {Task} from "../types"; // 假设你定义了 Task 接口（包含 id, title, status）

export default function TaskForm({ onTaskCreated }: { onTaskCreated: (task: Task) => void }) {
    const [task, setTask] = useState<Omit<Task, "id">>({ title: "", status: "ToDo" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post<Task>("/tasks", task);
            onTaskCreated(response.data); // ✅ 将新任务传回父组件
            setTask({ title: "", status: "ToDo" }); // 清空表单
        } catch (err) {
            console.error("Error creating task:", err);
            setError("Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <div>
                <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    required
                />
            </div>
            <div>
                <select name="status" value={task.status} onChange={handleChange}>
                    <option value="ToDo">ToDo</option>
                    <option value="InProgress">InProgress</option>
                    <option value="Done">Done</option>
                </select>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Task"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}
