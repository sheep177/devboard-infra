import { useNavigate } from "react-router-dom";
import type { Task } from "../types";
import { useState } from "react";
import { useProject } from "../contexts/ProjectContext";


export default function TaskList({
                                     tasks,
                                     loading,
                                     error,
                                     onReload,
                                     searchQuery,
                                     filterStatus,
                                     filterPriority,
                                     currentPage,
                                     tasksPerPage,
                                     onPageChange
                                 }: {
    tasks: Task[],
    loading: boolean,
    error: string,
    onReload: () => void,
    searchQuery: string,
    filterStatus: string,
    filterPriority: string,
    currentPage: number,
    tasksPerPage: number,
    onPageChange: (page: number) => void,
    sortBy?: string
}) {
    const { selectedProjectId } = useProject(); // ✅ 当前选中项目
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<"updatedAt" | "createdAt" | "title" | "status">("updatedAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const sortStatusWeight: Record<Task["status"], number> = {
        ToDo: 1,
        InProgress: 2,
        Done: 3,
    };

    const getStatusBadge = (status: string) => {
        const base = "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium";
        switch (status) {
            case "ToDo":
                return <span className={`${base} bg-gray-200 text-gray-700`}>📝 ToDo</span>;
            case "InProgress":
                return <span className={`${base} bg-blue-100 text-blue-700`}>🔧 In Progress</span>;
            case "Done":
                return <span className={`${base} bg-green-100 text-green-700`}>✅ Done</span>;
            default:
                return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
        }
    };

    const getPriorityBadge = (priority?: string) => {
        if (!priority) return null;
        const dotColor = {
            Low: "bg-green-500",
            Medium: "bg-blue-500",
            High: "bg-red-500",
        }[priority] || "bg-gray-400";

        return (
            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                <span>{priority}</span>
            </div>
        );
    };

    const filteredTasks = tasks
        .filter((task) => task.projectId === selectedProjectId)
        .filter((task) => filterPriority === "All" || task.priority === filterPriority)
        .filter((task) => filterStatus === "All" || task.status === filterStatus)
        .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            let aVal: string | number;
            let bVal: string | number;

            if (sortBy === "status") {
                aVal = sortStatusWeight[a.status];
                bVal = sortStatusWeight[b.status];
            } else if (sortBy === "title") {
                aVal = a.title.toLowerCase();
                bVal = b.title.toLowerCase();
            } else if (sortBy === "createdAt") {
                aVal = new Date(a.createdAt ?? "").getTime();
                bVal = new Date(b.createdAt ?? "").getTime();
            } else {
                aVal = new Date(a.updatedAt ?? "").getTime();
                bVal = new Date(b.updatedAt ?? "").getTime();
            }

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
            } else {
                return sortDirection === "asc"
                    ? (aVal as string).localeCompare(bVal as string)
                    : (bVal as string).localeCompare(aVal as string);
            }
        });

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const start = (currentPage - 1) * tasksPerPage;
    const pagedTasks = filteredTasks.slice(start, start + tasksPerPage);

    if (loading) return <p className="text-gray-500 italic">Loading tasks...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (filteredTasks.length === 0) return <p className="text-gray-400">No tasks matched your search.</p>;

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <label>Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as "updatedAt" | "createdAt" | "title" | "status")
                        }
                        className="border px-2 py-1 rounded"
                    >
                        <option value="updatedAt">Updated Time</option>
                        <option value="createdAt">Created Time</option>
                        <option value="title">Title</option>
                        <option value="status">Status</option>
                    </select>
                    <button
                        onClick={() =>
                            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                        }
                        className="text-blue-600 hover:underline"
                    >
                        {sortDirection === "asc" ? "▲ Ascending" : "▼ Descending"}
                    </button>
                </div>
            </div>

            <ul className="space-y-4 mt-4">
                {pagedTasks.map((task) => (
                    <li
                        key={task.id}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-4 bg-white rounded-xl shadow border-l-4 border-blue-500 hover:shadow-md transition cursor-pointer"
                    >
                        <div>
                            <p className="font-semibold text-gray-800 text-lg">{task.title}</p>
                            <div className="mt-1">{getStatusBadge(task.status)} {getPriorityBadge(task.priority)}</div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Are you sure you want to delete this task?")) {
                                    fetch(`http://localhost:8080/api/tasks/${task.id}`, {
                                        method: "DELETE",
                                    }).then(() => onReload());
                                }
                            }}
                            className="self-end sm:self-auto text-red-500 hover:text-red-600 font-medium hover:underline focus:outline-none bg-transparent p-0"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center items-center gap-4 mt-6 text-sm text-gray-600">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-blue-100"
                >
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-blue-100"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
