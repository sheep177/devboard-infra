import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import type { Task } from "../types";

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await api.get(`/tasks/${id}`);
                setTask(res.data);
                setError("");
            } catch (err) {
                console.error(err);
                setError("Task not found or failed to fetch.");
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    if (loading) return <p className="text-gray-500 italic">Loading task...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!task) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 text-sm underline hover:text-blue-800 mb-4"
                >
                    ← Back
                </button>

                <h2 className="text-2xl font-bold mb-2 text-gray-800">{task.title}</h2>
                <p className="text-sm text-gray-500 mb-4">Status: <strong>{task.status}</strong></p>

                <div className="border-t pt-4 mt-4">
                    <p className="text-gray-700">Task ID: {task.id}</p>
                    {/* 你可以在这里扩展更多字段 */}
                </div>
            </div>
        </div>
    );
}
