import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import api from "./api";
import type { Task } from "./types";

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [reload, setReload] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortBy, setSortBy] = useState("title"); // default sort



    const triggerReload = () => setReload((prev) => !prev);

    useEffect(() => {
        setLoading(true);
        api
            .get("/tasks")
            .then((res) => {
                setTasks(res.data);
                setError("");
            })
            .catch((err) => {
                console.error("Failed to fetch tasks:", err);
                setError("Failed to fetch tasks.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [reload]);

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
                    DevBoard Task Manager
                </h1>
                <input
                    type="text"
                    placeholder="🔍 Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* ✅ 状态筛选按钮 */}
                <div className="flex justify-center gap-2 mb-4 text-sm font-medium">
                    {["All", "ToDo", "InProgress", "Done"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1 rounded-full border ${
                                filterStatus === status
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-blue-100"
                            }`}
                        >
                            {status === "InProgress" ? "In Progress" : status}
                        </button>
                    ))}
                </div>

                <div className="mb-4">
                    <label className="mr-2 text-sm text-gray-700 font-medium">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="title">Title (A → Z)</option>
                        <option value="status">Status (ToDo → Done)</option>
                    </select>
                </div>



                <TaskForm onTaskCreated={triggerReload} />

                <hr className="my-4" />

                <TaskList
                    tasks={tasks}
                    loading={loading}
                    error={error}
                    onReload={triggerReload}
                    searchQuery={searchQuery}
                    filterStatus={filterStatus}
                    sortBy={sortBy}
                />

            </div>
        </div>
    );
}

export default App;
