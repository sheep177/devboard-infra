import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../types";
import { UserContext } from "./UserContext";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string; // username
    role: "ADMIN" | "MEMBER";
    exp: number;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        const payload = jwtDecode<JwtPayload>(token);
        setUser({
            id: 0,
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
            try {
                const payload = jwtDecode<JwtPayload>(token);
                setUser({
                    id: 0,
                    username: payload.sub,
                    role: payload.role,
                    tenantId: 101,
                });
            } catch (err) {
                console.error("Failed to decode JWT:", err);
                localStorage.removeItem("token");
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
