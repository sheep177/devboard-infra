import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../types";
import { UserContext } from "./UserContext";


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (username: string, token: string) => {
        localStorage.setItem("token", token);
        setUser({
            id: 0,
            username,
            role: username === "admin" ? "Admin" : "Member",
            tenantId: 101,
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const username = parseJwtUsername(token);
            if (username) {
                setUser({
                    id: 0,
                    username,
                    role: username === "admin" ? "Admin" : "Member",
                    tenantId: 101,
                });
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};


function parseJwtUsername(token: string): string | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub || null;
    } catch {
        return null;
    }
}
