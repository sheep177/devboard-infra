import { useState } from "react";
import api from "../api";
import type { Task } from "../types";

export default function TaskForm({ onTaskCreated }: { onTaskCreated: (task: Task) => void }) {
    const [task, setTask] = useState<Omit<Task, "id">>({
        title: "",
        status: "ToDo",
        priority: "Medium", // ✅ 默认值
    });
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
            onTaskCreated(response.data);
            setTask({ title: "", status: "ToDo", priority: "Medium" }); // ✅ 清空后保留默认
        } catch (err) {
            console.error("Error creating task:", err);
            setError("❌ Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Task Title</label>
                <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="ToDo">ToDo</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Priority</label>
                <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 text-white font-semibold rounded-lg transition ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {loading ? "Creating..." : "Create Task"}
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
}
