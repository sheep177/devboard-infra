// src/components/CommentThread.tsx
import { useState } from "react";
import api from "../api";
import { useUser } from "../contexts/useUser";

export interface Comment {
    id: number;
    taskId: number;
    content: string;
    userId: number;
    username: string;
    createdAt: string;
    parentId: number | null;
}

export default function CommentThread({ comment }: { comment: Comment }) {
    const { user } = useUser();
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<Comment[]>([]);
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const fetchReplies = async () => {
        const res = await api.get(`/comments/replies/${comment.id}`);
        setReplies(res.data);
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        if (!user) {
            alert("You must be logged in to reply.");
            return;
        }

        try {
            const res = await api.post("/comments", {
                content: replyText,
                taskId: comment.taskId,
                userId: user.id,
                username: user.username,
                parentId: comment.id,
            });
            setReplies([...replies, res.data]);
            setReplyText("");
            setReplying(false);
            setShowReplies(true);
        } catch (err) {
            console.error("Failed to post reply:", err);
            alert("Reply failed.");
        }
    };

    const toggleReplies = async () => {
        if (!showReplies) await fetchReplies();
        setShowReplies((prev) => !prev);
    };

    const handleEdit = async () => {
        if (!editText.trim()) return;
        if (!user) {
            alert("You must be logged in to edit a comment.");
            return;
        }

        try {
            const res = await api.put(`/comments/${comment.id}`, {
                content: editText,
                userId: user.id,
            });

            setEditing(false);
            setEditText(res.data.content); // 更新本地内容（可替代父组件传入 onEdit）
        } catch (err) {
            console.error("Failed to edit comment", err);
            alert("Edit failed.");
        }
    };

    return (
        <div className="ml-4 mt-3">
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
                {editing ? (
                    <div className="mt-2 flex gap-2">
                        <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-grow px-2 py-1 border rounded text-sm"
                        />
                        <button
                            onClick={handleEdit}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="text-gray-500 text-sm underline"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-800">{editText}</p>
                        <div className="text-xs text-gray-500 mt-1 flex justify-between">
                            <span>
                                <strong>{comment.username}</strong> · {new Date(comment.createdAt).toLocaleString()}
                            </span>
                            <div className="space-x-2">
                                {user && user.id === comment.userId && (
                                    <button
                                        className="text-orange-500 hover:underline"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit
                                    </button>
                                )}
                                {user && (
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setReplying(!replying)}
                                    >
                                        Reply
                                    </button>
                                )}
                                <button
                                    className="text-gray-500 hover:underline"
                                    onClick={toggleReplies}
                                >
                                    {showReplies ? "Hide Replies" : "Show Replies"}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {replying && (
                    <div className="mt-2 flex gap-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-grow px-2 py-1 border rounded text-sm"
                            placeholder="Write a reply..."
                        />
                        <button
                            onClick={handleReply}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                            Send
                        </button>
                    </div>
                )}
            </div>

            {showReplies && replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {replies.map((r) => (
                        <CommentThread key={r.id} comment={r} />
                    ))}
                </div>
            )}
        </div>
    );
}
