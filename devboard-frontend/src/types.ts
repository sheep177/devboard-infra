export interface Task {
    id: number;
    title: string;
    status: string;
}

export interface User {
    id: number;
    username: string;
    role: "Admin" | "Member";
    tenantId: number;
}
