import { useEffect, useState } from "react";
import api from "../api";
import { useUser } from "../contexts/UserContext";

interface Comment {
    id: number;
    taskId: number;
    userId: number;
    username: string;
    content: string;
    createdAt: string;
    tenantId: number;
}

export default function CommentSection({ taskId }: { taskId: number }) {
    const { user } = useUser();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    const fetchComments = () => {
        api.get(`/comments/${taskId}`).then((res) => setComments(res.data));
    };

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await api.post("/comments", {
            taskId,
            userId: user!.id,
            username: user!.username,
            content: newComment.trim(),
            tenantId: user!.tenantId,
        });

        setNewComment("");
        fetchComments();
    };

    return (
        <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-gray-800">💬 Comments</h3>
            {comments.length === 0 && (
                <p className="text-sm text-gray-500">No comments yet.</p>
            )}

            <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {comments.map((c) => (
                    <li
                        key={c.id}
                        className="bg-gray-50 p-2 rounded border text-sm text-gray-800"
                    >
                        <strong>{c.username}</strong>: {c.content}
                        <div className="text-xs text-gray-400 mt-1">
                            {new Date(c.createdAt).toLocaleString()}
                        </div>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Post
                </button>
            </form>
        </div>
    );
}
