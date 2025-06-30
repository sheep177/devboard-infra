import type { Task } from "../types";

export default function TaskList({
                                     tasks,
                                     loading,
                                     error,
                                     onReload,
                                     searchQuery,
                                     filterStatus,
                                     sortBy,
                                     currentPage,
                                     tasksPerPage,
                                     onPageChange,
                                     onSelect, // ✅ 传入点击任务回调
                                 }: {
    tasks: Task[];
    loading: boolean;
    error: string;
    onReload: () => void;
    searchQuery: string;
    filterStatus: string;
    sortBy: string;
    currentPage: number;
    tasksPerPage: number;
    onPageChange: (page: number) => void;
    onSelect: (task: Task) => void;
}) {
    if (loading) return <p className="text-gray-500 italic">Loading tasks...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

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

    const filteredTasks = tasks
        .filter((task) =>
            filterStatus === "All" ? true : task.status === filterStatus
        )
        .filter((task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "title") {
                return a.title.localeCompare(b.title);
            } else if (sortBy === "status") {
                return sortStatusWeight[a.status] - sortStatusWeight[b.status];
            } else {
                return 0;
            }
        });

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const start = (currentPage - 1) * tasksPerPage;
    const pagedTasks = filteredTasks.slice(start, start + tasksPerPage);

    if (filteredTasks.length === 0)
        return <p className="text-gray-400">No tasks matched your search.</p>;

    return (
        <div>
            <ul className="space-y-4 mt-4">
                {pagedTasks.map((task) => (
                    <li
                        key={task.id}
                        onClick={() => onSelect(task)}
                        className="flex justify-between items-center p-4 bg-white rounded-xl shadow border-l-4 border-blue-500 hover:shadow-md transition cursor-pointer"
                    >
                        <div>
                            <p className="font-semibold text-gray-800 text-lg">{task.title}</p>
                            <div className="mt-1">{getStatusBadge(task.status)}</div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // ✅ 避免点击 delete 时也触发 onSelect
                                if (confirm("Are you sure you want to delete this task?")) {
                                    fetch(`http://localhost:8080/api/tasks/${task.id}`, {
                                        method: "DELETE",
                                    }).then(() => onReload());
                                }
                            }}
                            className="text-red-500 hover:text-red-600 font-medium hover:underline focus:outline-none bg-transparent p-0"
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
