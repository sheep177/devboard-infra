// src/contexts/UserProvider.tsx
import { useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { UserContext, type User } from "./UserContext";

interface DecodedToken {
    sub: string;       // username
    role: string;      // "ADMIN" or "MEMBER"
    tenantId: number;
    exp: number;
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (token: string) => {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const newUser: User = {
                username: decoded.sub,
                role: decoded.role,
                tenantId: decoded.tenantId,
                token,
            };
            setUser(newUser);
            localStorage.setItem("token", token);
        } catch (err) {
            console.error("JWT decode failed:", err);
            logout();
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) login(token);
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}
