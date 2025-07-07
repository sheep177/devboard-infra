// src/contexts/ProjectContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ProjectContextType {
    selectedProjectId: number | null;
    setSelectedProjectId: (id: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const { projectId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (projectId) {
            const parsed = parseInt(projectId);
            if (!isNaN(parsed)) {
                setSelectedProjectId(parsed);
            }
        }
    }, [projectId]);

    const updateProjectId = (id: number) => {
        setSelectedProjectId(id);
        navigate(`/project/${id}`);
    };

    return (
        <ProjectContext.Provider value={{ selectedProjectId, setSelectedProjectId: updateProjectId }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
}
