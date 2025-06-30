// src/components/TaskItem.tsx
import { useState } from "react";
import type { Task } from "../types";
import api from "../api";

export default function TaskItem({
                                     task,
                                     onUpdated,
                                     onDeleted,
                                 }: {
    task: Task;
    onUpdated: () => void;
    onDeleted: () => void;
}) {
    const [title, setTitle] = useState(task.title);
    const [status, setStatus] = useState(task.status);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (title === task.title && status === task.status) return; // no change
        setLoading(true);
        try {
            await api.put(`/tasks/${task.id}`, { title, status });
            onUpdated();
        } catch (err) {
            alert("Failed to update task");
            console.error(err);
        } finally {
            setLoading(false);
            setEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${task.id}`);
            onDeleted();
        } catch (err) {
            alert("Failed to delete task");
            console.error(err);
        }
    };

    return (
        <li className="flex justify-between items-center p-4 bg-white rounded-xl shadow border-l-4 border-blue-500 hover:shadow-md transition">
            <div className="flex flex-col gap-1 w-full mr-4">
                {editing ? (
                    <>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleUpdate}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            autoFocus
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            onBlur={handleUpdate}
                            className="w-fit mt-1 px-2 py-1 border rounded bg-gray-50"
                        >
                            <option value="ToDo">ToDo</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </>
                ) : (
                    <>
                        <p
                            className="font-semibold text-lg text-gray-800 cursor-pointer hover:underline"
                            onClick={() => setEditing(true)}
                        >
                            {title}
                        </p>
                        <span className="text-xs inline-block mt-1 px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
              {status}
            </span>
                    </>
                )}
            </div>
            <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-500 hover:text-red-600 font-medium hover:underline focus:outline-none bg-transparent p-0"
            >
                Delete
            </button>
        </li>
    );
}
