export interface Task {
    id: number;
    title: string;
    status: string;
    description?: string;
    createdAt?: string;
    updatedAt: string;
    priority?: "Low" | "Medium" | "High";
    projectId: number;
}

export interface User {
    id: number;
    username: string;
    role: "Admin" | "Member";
    tenantId: number;
}
export interface Comment {
    id: number;
    content: string;
    userId: number;
    taskId: number;
    createdAt: string;
}


export interface Project {
    id: number;
    name: string;
    createdAt?: string;
}
