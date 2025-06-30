import CommentSection from "./CommentSection";
import type {Task} from "../types.ts";

export default function TaskModal({ task, onClose }: { task: Task; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
                >
                    ×
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    📝 {task.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">Status: {task.status}</p>


                <CommentSection taskId={task.id!} />
            </div>
        </div>
    );
}
