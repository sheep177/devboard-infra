import type { Task } from "../types";

export default function TaskModal({
                                      task,
                                      onClose,
                                  }: {
    task: Task;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-blue-600 mb-4">Task Details</h2>
                <p className="text-gray-800 mb-2">
                    <span className="font-semibold">Title:</span> {task.title}
                </p>
                <p className="text-gray-800 mb-4">
                    <span className="font-semibold">Status:</span> {task.status}
                </p>

                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
