
import { createContext } from "react";
import type { User } from "../types";

export interface UserContextType {
    user: User | null;
    login: (username: string) => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
