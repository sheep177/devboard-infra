import { useState } from "react";
import CommentSection from "./CommentSection";
import api from "../api";
import type { Task } from "../types";

export default function TaskModal({
                                      task,
                                      onClose,
                                      onUpdate,
                                  }: {
    task: Task;
    onClose: () => void;
    onUpdate: () => void;
}) {
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedStatus, setEditedStatus] = useState(task.status);
    const [editedPriority, setEditedPriority] = useState<Task["priority"]>(task.priority ?? "Medium");
    const [editedDescription, setEditedDescription] = useState(task.description ?? "");

    const handleSave = async () => {
        try {
            await api.put(`/tasks/${task.id}`, {
                ...task,
                title: editedTitle,
                status: editedStatus,
                priority: editedPriority,
                description: editedDescription,
            });
            onUpdate();
            onClose();
        } catch (err) {
            alert("Failed to update task");
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
                >
                    ×
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 Edit Task</h2>

                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="ToDo">ToDo</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                </select>

                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                    value={editedPriority}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "Low" || value === "Medium" || value === "High") {
                            setEditedPriority(value);
                        }
                    }}
                    className="w-full px-3 py-1.5 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    rows={3}
                />

                <div className="flex justify-end gap-2 mb-4">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 rounded border text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>

                {/* 评论区域 */}
                <CommentSection taskId={task.id!} />
            </div>
        </div>
    );
}
