import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../types";
import { UserContext } from "./UserContext";
import { jwtDecode } from "jwt-decode";



export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    interface JwtPayload {
        sub: string; // username
        role: "ADMIN" | "MEMBER";
        exp: number;
    }

    const login = ( token: string) => {
        localStorage.setItem("token", token);

        const payload = jwtDecode<JwtPayload>(token);

        setUser({
            id: 0, // 可以改为后续真实 ID（未来从后端再查用户详情也行）
            username: payload.sub,
            role: payload.role,
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
                    role: username === "admin" ? "ADMIN" : "MEMBER",
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
