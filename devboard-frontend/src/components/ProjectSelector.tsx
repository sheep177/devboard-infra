// src/components/ProjectSelector.tsx
import { useEffect, useState } from "react";
import { useProject } from "../contexts/ProjectContext";

// 假数据，后续用 api.get("/projects") 替换
const mockProjects = [
    { id: 1, name: "Design System" },
    { id: 2, name: "Frontend Revamp" },
    { id: 3, name: "Backend Refactor" },
];

export default function ProjectSelector() {
    const { selectedProjectId, setSelectedProjectId } = useProject();
    const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        setProjects(mockProjects); // 🚧 后续用 api 调用替换
    }, []);

    return (
        <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Select Project</label>
            <select
                value={selectedProjectId ?? ""}
                onChange={(e) => {
                    const id = parseInt(e.target.value);
                    if (!isNaN(id)) setSelectedProjectId(id);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
                <option value="" disabled>Select a project</option>
                {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                        {proj.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
