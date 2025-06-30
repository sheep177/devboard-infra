import type { Task } from "../types";
import api from "../api";

export default function TaskList({
                                     tasks,
                                     loading,
                                     error,
                                     onDelete,
                                 }: {
    tasks: Task[];
    loading: boolean;
    error: string;
    onDelete: () => void;
}) {
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${id}`);
            onDelete();
        } catch (err) {
            console.error("Failed to delete task:", err);
            alert("Delete failed");
        }
    };

    const getStatusBadge = (status: string) => {
        const base = "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium";
        switch (status) {
            case "ToDo":
                return <span className={`${base} bg-gray-200 text-gray-700`}>📝 ToDo</span>;
            case "InProgress":
                return <span className={`${base} bg-blue-100 text-blue-700`}>🔧 In Progress</span>;
            case "Done":
                return <span className={`${base} bg-green-100 text-green-700`}>✅ Done</span>;
            default:
                return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
        }
    };

    if (loading) return <p className="text-gray-500 italic">Loading tasks...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!tasks || tasks.length === 0) return <p className="text-gray-400">No tasks found.</p>;

    return (
        <ul className="space-y-4 mt-4">
            {tasks.map((task) => (
                <li
                    key={task.id}
                    className="flex justify-between items-center p-4 bg-white rounded-xl shadow border-l-4 border-blue-500 hover:shadow-md transition"
                >
                    <div>
                        <p className="font-semibold text-gray-800 text-lg">{task.title}</p>
                        <div className="mt-1">{getStatusBadge(task.status)}</div>
                    </div>
                    <button
                        onClick={() => handleDelete(task.id!)}
                        className="text-red-500 hover:text-red-600 font-medium hover:underline focus:outline-none bg-transparent p-0"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}
