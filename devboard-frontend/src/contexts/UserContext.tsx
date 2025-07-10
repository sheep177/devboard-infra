// src/contexts/UserContext.ts
import { createContext } from "react";

export interface User {
    username: string;
    role: string;
    tenantId: number;
    token: string;
}

interface UserContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);
