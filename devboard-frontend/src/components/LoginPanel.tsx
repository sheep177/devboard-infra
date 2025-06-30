import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function LoginPanel() {
  const { login } = useUser();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    login(username.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600">
          DevBoard Login
        </h1>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded bg-blue-600 hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-sm text-gray-500 text-center">
          Use <strong>admin</strong> for Admin role
        </p>
      </form>
    </div>
  );
}
