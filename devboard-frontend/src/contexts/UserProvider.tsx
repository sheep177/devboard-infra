// src/contexts/UserProvider.tsx

import { useState, useEffect, type ReactNode } from "react";
import { UserContext } from "./UserContext";
import type { User } from "../types";

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            setUser(JSON.parse(saved));
        }
    }, []);

    const login = (username: string) => {
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        let existing = allUsers.find((u: User) => u.username === username);

        if (!existing) {
            const newId =
                allUsers.length > 0
                    ? Math.max(...allUsers.map((u: User) => u.id)) + 1
                    : 1;
            existing = {
                id: newId,
                username,
                role: username === "admin" ? "Admin" : "Member",
                tenantId: 101,
            };
            allUsers.push(existing);
            localStorage.setItem("allUsers", JSON.stringify(allUsers));
        }

        setUser(existing);
        localStorage.setItem("user", JSON.stringify(existing));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
