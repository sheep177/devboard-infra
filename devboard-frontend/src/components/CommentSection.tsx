// src/components/CommentSection.tsx
import { useEffect, useState } from "react";
import api from "../api";
import { useUser } from "../contexts/useUser";
import CommentThread from "./CommentThread";

export interface Comment {
    id: number;
    taskId: number;
    content: string;
    userId: number;
    username: string;
    createdAt: string;
    parentId: number | null;
}

export default function CommentSection({ taskId }: { taskId: number }) {
    const { user } = useUser();
    const [topComments, setTopComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);

    const fetchTopLevel = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/comments/${taskId}/top`, {
                params: { sort: sortOrder },
            });
            setTopComments(res.data ?? []);
        } catch (err) {
            console.error("Failed to load comments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchTopLevel();
    }, [taskId, user, sortOrder]);

    const handleAddTopComment = async () => {
        if (!newComment.trim()) return;
        if (!user) {
            alert("You must be logged in to post a comment.");
            return;
        }

        setPosting(true);
        try {
            const res = await api.post("/comments", {
                content: newComment,
                taskId,
                userId: user.id,
                username: user.username,
                parentId: null,
            });
            setTopComments((prev) =>
                sortOrder === "desc" ? [res.data, ...prev] : [...prev, res.data]
            );
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment:", err);
            alert("Failed to post comment.");
        } finally {
            setPosting(false);
        }
    };

    if (!user) {
        return <p className="text-red-500">Please log in to view or post comments.</p>;
    }

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700">💬 Comments</h3>
                <button
                    onClick={() =>
                        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                    }
                    className="text-blue-600 text-sm hover:underline"
                >
                    Sort: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                </button>
            </div>

            {loading ? (
                <p className="text-gray-400">Loading comments...</p>
            ) : (
                <div className="space-y-4">
                    {topComments.map((c) => (
                        <CommentThread key={c.id} comment={c} />
                    ))}
                </div>
            )}

            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-grow px-3 py-1.5 border border-gray-300 rounded text-sm"
                />
                <button
                    onClick={handleAddTopComment}
                    disabled={posting}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
                >
                    {posting ? "Posting..." : "Post"}
                </button>
            </div>
        </div>
    );
}
