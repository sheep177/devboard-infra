import { useState } from "react";
import { useUser } from "../contexts/useUser";

export default function AuthPanel() {
    const { login } = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        try {
            const endpoint = isRegister ? "/auth/register" : "/auth/login";
            const res = await fetch(`/api${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim(), password }),
            });

            const result = await res.text();
            if (!res.ok) {
                setError(result);
                return;
            }

            if (!isRegister) {
                login(username.trim(), result); // result 是 token
            } else {
                alert("✅ 注册成功，请登录");
                setIsRegister(false);
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm space-y-4"
            >
                <h1 className="text-2xl font-bold text-center text-blue-600">
                    DevBoard {isRegister ? "Register" : "Login"}
                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}
                <button
                    type="submit"
                    className="w-full py-2 text-white font-semibold rounded bg-blue-600 hover:bg-blue-700 transition"
                >
                    {isRegister ? "Register" : "Login"}
                </button>
                <p className="text-sm text-gray-500 text-center">
                    {isRegister ? (
                        <>
                            已有账号？{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(false);
                                    setError("");
                                }}
                                className="text-blue-500 underline"
                            >
                                去登录
                            </button>
                        </>
                    ) : (
                        <>
                            没有账号？{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(true);
                                    setError("");
                                }}
                                className="text-blue-500 underline"
                            >
                                去注册
                            </button>
                        </>
                    )}
                </p>
            </form>
        </div>
    );
}
