import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import type { Task } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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

    const renderPriority = (priority: string | undefined) => {
        if (!priority) return null;
        const dot = {
            Low: "bg-green-500",
            Medium: "bg-blue-500",
            High: "bg-red-500",
        }[priority] || "bg-gray-400";

        return (
            <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-500">Priority:</span>
                <span className="flex items-center gap-1 text-sm text-gray-800">
                    <span className={`w-2.5 h-2.5 rounded-full ${dot}`}></span>
                    {priority}
                </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                >
                    ← Back
                </button>

                <h2 className="text-3xl font-bold text-gray-800">{task.title}</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-500">Status:</span>
                        <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                task.status === "ToDo"
                                    ? "bg-gray-200 text-gray-700"
                                    : task.status === "InProgress"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                            }`}
                        >
                            {task.status}
                        </span>
                    </div>
                    {renderPriority(task.priority)}
                </div>

                {task.description && (
                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-600">Description</h3>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{task.description}</p>
                    </div>
                )}

                <hr />

                <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Task ID:</strong> {task.id}</p>
                    {task.createdAt && (
                        <p>
                            <strong>Created:</strong>{" "}
                            {dayjs(task.createdAt).fromNow()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
