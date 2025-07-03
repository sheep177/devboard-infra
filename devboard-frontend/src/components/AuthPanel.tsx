import { useState } from "react";
import axios from "../api";
import { useUser } from "../contexts/useUser";

export default function AuthPanel() {
  const { setUser, setToken } = useUser();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
      const response = await axios.post(endpoint, { username, password });

      if (isLoginMode) {
        setToken(response.data); // JWT token
        setUser({ username });
        localStorage.setItem("token", response.data);
      } else {
        alert("Registration successful. You can now log in.");
        setIsLoginMode(true);
      }
      setError("");
    } catch (err: any) {
      setError(err.response?.data || "Authentication failed");
    }
  };

  return (
      <div className="p-4 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {isLoginMode ? "Login" : "Register"}
        </h2>
        <input
            className="w-full mb-2 p-2 border"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            className="w-full mb-2 p-2 border"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
            className="w-full bg-blue-600 text-white p-2 rounded"
            onClick={handleAuth}
        >
          {isLoginMode ? "Login" : "Register"}
        </button>
        <p className="text-sm mt-3 text-center">
          {isLoginMode ? "No account?" : "Already have an account?"}{" "}
          <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setIsLoginMode(!isLoginMode)}
          >
          {isLoginMode ? "Register" : "Login"}
        </span>
        </p>
      </div>
  );
}
