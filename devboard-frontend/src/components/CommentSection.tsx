import { useEffect, useState } from "react";
import api from "../api";
import { useUser } from "../contexts/useUser";

interface Comment {
    id: number;
    taskId: number;
    userId: number;
    username: string;
    content: string;
    createdAt: string;
    tenantId: number;
    parentId: number | null;
}

export default function CommentSection({ taskId }: { taskId: number }) {
    const { user } = useUser();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<number | null>(null);
    console.log("当前登录用户ID：", user?.id);
    console.log("每条评论：", comments);


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
            parentId: replyTo,
        });

        setNewComment("");
        setReplyTo(null);
        fetchComments();
    };

    const handleDelete = async (id: number) => {
        if (!user) return; // 没登录就不操作

        if (!confirm("Are you sure you want to delete this comment?")) return;

        await api.delete(`/comments/${id}`, {
            data: {
                userId: user.id,
                role: user.role,
            },
        });

        fetchComments(); // 记得刷新
    };


    const renderComments = (parentId: number | null = null) => {
        return comments
            .filter((c) => c.parentId === parentId)
            .map((c) => (
                <div key={c.id} className="pl-2 border-l border-gray-200 mt-2">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-800">
                            <strong>{c.username}</strong>: {c.content}
                        </p>
                        {(user?.role === "Admin" || c.userId === user?.id) && (
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="text-xs text-red-400 hover:text-red-600 ml-2"
                                title="Delete"
                            >
                                🗑
                            </button>
                        )}
                    </div>
                    <div className="text-xs text-gray-400 ml-1">
                        {new Date(c.createdAt).toLocaleString()}
                    </div>
                    <button
                        onClick={() =>
                            setReplyTo(replyTo === c.id ? null : c.id)
                        }
                        className="text-xs text-blue-500 ml-1 hover:underline"
                    >
                        {replyTo === c.id ? "Cancel" : "Reply"}
                    </button>

                    {/* ✅ 嵌套回复 */}
                    {replyTo === c.id && (
                        <form
                            onSubmit={handleSubmit}
                            className="flex gap-2 mt-2 items-center"
                        >
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                            <button
                                type="submit"
                                className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Reply
                            </button>
                        </form>
                    )}

                    {/* ✅ 渲染子评论 */}
                    <div className="ml-3">{renderComments(c.id)}</div>
                </div>
            ));
    };

    return (
        <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-gray-800">💬 Comments</h3>

            {renderComments()}

            {/* 顶级评论框 */}
            <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
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
