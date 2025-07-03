import { useEffect, useState } from "react";
import api from "../api";
import { useUser } from "../contexts/useUser";

interface Comment {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
}

export default function CommentSection({ taskId }: { taskId: number }) {
    const { user } = useUser(); // ⬅️ 确保 useUser 在顶层调用

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/comments/${taskId}`, {
                params: {
                    page,
                    size: 5,
                },
            });
            setComments(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Failed to load comments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchComments();
        }
    }, [taskId, page, user]);

    const handleAdd = async () => {
        if (!newComment.trim()) return;
        setPosting(true);
        try {
            const res = await api.post("/comments", {
                content: newComment,
                taskId,
                userId: user.id,
            });

            setComments((prev) => [res.data, ...prev]);
            setNewComment("");
            setPage(0);
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setPosting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this comment?")) return;
        try {
            await api.delete(`/comments/${id}`, {
                data: {
                    userId: user.id,
                    role: user.role,
                },
            });
            setComments((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    if (!user) {
        return <p className="text-red-500 text-sm">⚠️ Please log in to view or post comments.</p>;
    }

    return (
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">💬 Comments</h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
                {loading ? (
                    <p className="text-gray-400 italic">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-gray-400">No comments yet.</p>
                ) : (
                    comments.map((c) => (
                        <div key={c.id} className="bg-gray-100 rounded p-2 text-sm flex justify-between items-center">
                            <div>
                                <p className="text-gray-800">{c.content}</p>
                                <p className="text-gray-500 text-xs">{new Date(c.createdAt).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="text-red-500 text-xs ml-4 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* 分页控件 */}
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    Prev
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                    Next
                </button>
            </div>

            {/* 添加评论 */}
            <div className="mt-3 flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-grow px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
                <button
                    onClick={handleAdd}
                    disabled={posting}
                    className={`px-3 py-1.5 text-white text-sm rounded ${
                        posting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {posting ? "Posting..." : "Post"}
                </button>
            </div>
        </div>
    );
}
