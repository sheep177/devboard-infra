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

    const fetchReplies = async () => {
        const res = await api.get(`/comments/replies/${comment.id}`);
        setReplies(res.data);
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        const res = await api.post("/comments", {
            content: replyText,
            taskId: comment.taskId, // 👈 用 parent 评论的 taskId
            userId: user.id,
            username: user.username,
            parentId: comment.id,
        });
        setReplies([...replies, res.data]);
        setReplyText("");
        setReplying(false);
        setShowReplies(true);
    };

    const toggleReplies = async () => {
        if (!showReplies) await fetchReplies();
        setShowReplies((prev) => !prev);
    };

    return (
        <div className="ml-4 mt-3">
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
                <p className="text-gray-800">{comment.content}</p>
                <div className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>
                        <strong>{comment.username}</strong> · {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    <div className="space-x-2">
                        <button className="text-blue-500 hover:underline" onClick={() => setReplying(!replying)}>
                            Reply
                        </button>
                        <button className="text-gray-500 hover:underline" onClick={toggleReplies}>
                            {showReplies ? "Hide Replies" : "Show Replies"}
                        </button>
                    </div>
                </div>
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
