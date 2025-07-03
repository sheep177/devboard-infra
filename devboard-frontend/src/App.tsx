import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import TaskDetail from "./components/TaskDetail";
import LoginPanel from "./components/LoginPanel";
import { useUser } from "./contexts/useUser";
import api from "./api";
import type { Task } from "./types";

function App() {
    const { user, logout } = useUser();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [reload, setReload] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState("All");
    const [sortBy, setSortBy] = useState("title");
    const [currentPage, setCurrentPage] = useState(1);
    const TASKS_PER_PAGE = 5;
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const triggerReload = () => setReload((prev) => !prev);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get("/tasks");
            setTasks(res.data);
            setError("");
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setError("Failed to fetch tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [reload]);

    if (!user) return <LoginPanel />;

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="min-h-screen bg-gray-100 px-4 py-8">
                            <div className="w-full max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-md relative">
                                <h1 className="text-2xl font-bold text-center mb-3 text-blue-600">
                                    DevBoard Task Manager
                                </h1>
                                <div className="text-sm text-gray-600 text-center mb-6 flex justify-between items-center">
                                    <span>
                                        👋 Logged in as <strong>{user.username}</strong> ({user.role})
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="text-red-500 text-xs underline hover:text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    placeholder="🔍 Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />

                                <div className="flex flex-wrap justify-center gap-2 mb-4 text-sm font-medium">
                                    {["All", "ToDo", "InProgress", "Done"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setFilterStatus(status);
                                                setCurrentPage(1);
                                            }}
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

                                <div className="flex flex-wrap justify-center gap-2 mb-4 text-sm font-medium">
                                    {["All", "Low", "Medium", "High"].map((priority) => (
                                        <button
                                            key={priority}
                                            onClick={() => {
                                                setFilterPriority(priority);
                                                setCurrentPage(1);
                                            }}
                                            className={`px-3 py-1 rounded-full border ${
                                                filterPriority === priority
                                                    ? "bg-purple-600 text-white"
                                                    : "bg-white text-gray-600 border-gray-300 hover:bg-purple-100"
                                            }`}
                                        >
                                            {priority}
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
                                    filterPriority={filterPriority} // ✅ 新增
                                    sortBy={sortBy}
                                    currentPage={currentPage}
                                    tasksPerPage={TASKS_PER_PAGE}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                            {selectedTask && (
                                <TaskModal
                                    task={selectedTask}
                                    onClose={() => setSelectedTask(null)}
                                    onUpdate={fetchTasks}
                                />
                            )}
                        </div>
                    }
                />
                <Route path="/tasks/:id" element={<TaskDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
