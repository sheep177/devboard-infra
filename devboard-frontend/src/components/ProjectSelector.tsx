// src/components/ProjectSelector.tsx
import { useProject } from "../contexts/ProjectContext";

export default function ProjectSelector() {
    const { selectedProjectId, setSelectedProjectId, projects } = useProject();

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
