import type { Task } from "../types";
import TaskItem from "./TaskItem";

export default function TaskList({
                                     tasks,
                                     loading,
                                     error,
                                     onReload,
                                     searchQuery,
                                     filterStatus,
                                     sortBy,
                                 }: {
    tasks: Task[];
    loading: boolean;
    error: string;
    onReload: () => void;
    searchQuery: string;
    filterStatus: string;
    sortBy: string;
}) {
    if (loading) return <p className="text-gray-500 italic">Loading tasks...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    // ✅ 类型安全的状态排序映射
    const sortStatusWeight: Record<Task["status"], number> = {
        ToDo: 1,
        InProgress: 2,
        Done: 3,
    };

    // ✅ 双重过滤 + 排序
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

    if (filteredTasks.length === 0)
        return <p className="text-gray-400">No tasks matched your search.</p>;

    return (
        <ul className="space-y-4 mt-4">
            {filteredTasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onUpdated={onReload}
                    onDeleted={onReload}
                />
            ))}
        </ul>
    );
}
