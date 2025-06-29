import type { Task } from "../types";

export default function TaskList({
                                     tasks,
                                     loading,
                                     error,
                                 }: {
    tasks: Task[];
    loading: boolean;
    error: string;
}) {
    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    if (!tasks || tasks.length === 0) {
        return <p>No tasks found.</p>;
    }

    return (
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>
                    <strong>{task.title}</strong> — {task.status}
                </li>
            ))}
        </ul>
    );
}


