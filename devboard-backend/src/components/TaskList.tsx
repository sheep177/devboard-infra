// src/components/TaskList.tsx
import { useEffect, useState } from "react";
import api from "../api";

interface Task {
    id: number;
    title: string;
    status: string;
}

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        api.get("/tasks").then((res) => {
            setTasks(res.data);
        });
    }, []);

    return (
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <strong>{task.title}</strong> - {task.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}
