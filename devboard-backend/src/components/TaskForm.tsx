// src/components/TaskForm.tsx
import React, { useState } from "react";
import api from "../api";

interface Props {
    onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: Props) {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("ToDo");

    const handleSubmit: (e: React.FormEvent) => Promise<void> = async (e) => {
        e.preventDefault();
        await api.post("/tasks", { title, status });
        setTitle("");
        setStatus("ToDo");
        onTaskCreated(); // refresh list
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                required
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="ToDo">ToDo</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <button type="submit">Add Task</button>
        </form>
    );
}
