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

export type Role = "ADMIN" | "MEMBER";

export interface User {
    id: number;
    username: string;
    role: Role;
    tenantId: number;
}

export interface Comment {
    id: number;
    content: string;
    userId: number;
    taskId: number;
    createdAt: string;
    replies?: Comment[]; // ✅ 添加这一行
}


export interface Project {
    id: number;
    name: string;
    createdAt?: string;
}
