// src/contexts/ProjectContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import type { Project } from "../types";

interface ProjectContextType {
    selectedProjectId: number | null;
    setSelectedProjectId: (id: number) => void;
    projects: Project[];
    fetchProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
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

    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch projects:", err);
        }
    };

    // 初始化时自动加载项目列表
    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <ProjectContext.Provider
            value={{
                selectedProjectId,
                setSelectedProjectId: updateProjectId,
                projects,
                fetchProjects,
            }}
        >
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
