import { useState } from "react";

export default function GitHubPRComments() {
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [prNumber, setPrNumber] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchComments = async () => {
        setLoading(true);
        setError("");
        setComments([]);

        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments`);
            if (!res.ok) throw new Error("Failed to fetch comments");

            const data = await res.json();
            setComments(data);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 p-4 border rounded-xl shadow bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">GitHub PR Comments</h3>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    className="border px-2 py-1 rounded w-full sm:w-auto"
                    placeholder="Owner (e.g. vercel)"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                />
                <input
                    className="border px-2 py-1 rounded w-full sm:w-auto"
                    placeholder="Repo (e.g. next.js)"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                />
                <input
                    className="border px-2 py-1 rounded w-full sm:w-auto"
                    placeholder="PR Number"
                    value={prNumber}
                    onChange={(e) => setPrNumber(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    onClick={fetchComments}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Fetch"}
                </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li key={comment.id} className="bg-white p-3 rounded shadow border">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={comment.user.avatar_url} alt="avatar" className="w-6 h-6 rounded-full" />
                            <span className="font-medium text-gray-700">{comment.user.login}</span>
                            <span className="text-xs text-gray-400 ml-auto">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
