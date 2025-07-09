import { useState, useEffect } from "react";
import { useUser } from "../contexts/useUser";
import { useTasks } from "../contexts/TaskContext";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import ProjectSelector from "../components/ProjectSelector";
import { useNavigate, useLocation } from "react-router-dom";
import type { Task } from "../types";

export default function MainPage() {
    const { user, logout } = useUser();
    const { tasks, loading, fetchTasks } = useTasks();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState("All");
    const [sortBy, setSortBy] = useState("title");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const TASKS_PER_PAGE = 5;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (location.state?.reload) {
            fetchTasks();
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="w-full max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-md relative">
                <h1 className="text-2xl font-bold text-center mb-3 text-blue-600">
                    DevBoard Task Manager
                </h1>
                <ProjectSelector />
                <div className="text-sm text-gray-600 text-center mb-6 flex justify-between items-center">
                    <span>
                        👋 Logged in as <strong>{user?.username}</strong> ({user?.role})
                    </span>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate("/board")}
                            className="text-blue-500 text-xs underline hover:text-blue-700"
                        >
                            🗂 View Board
                        </button>

                        {user?.role === "ADMIN" && (
                            <button
                                onClick={() => navigate("/admin")}
                                className="text-green-600 text-xs underline hover:text-green-800"
                            >
                                🛡 Admin Panel
                            </button>
                        )}

                        <button
                            onClick={logout}
                            className="text-red-500 text-xs underline hover:text-red-600"
                        >
                            Logout
                        </button>
                    </div>
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
                        <option value="priority">Priority (High → Low)</option>
                        <option value="createdAt">Created Time (Newest First)</option>
                        <option value="updatedAt">Updated Time (Recent First)</option>
                    </select>
                </div>

                <TaskForm onTaskCreated={fetchTasks} />
                <hr className="my-4" />

                <TaskList
                    tasks={tasks}
                    loading={loading}
                    error=""
                    onReload={fetchTasks}
                    searchQuery={searchQuery}
                    filterStatus={filterStatus}
                    filterPriority={filterPriority}
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
    );
}
