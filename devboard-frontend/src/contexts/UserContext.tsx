import { createContext, useContext, useState, useEffect } from "react";

export interface User {
    id: number;
    username: string;
    role: "Admin" | "Member";
    tenantId: number;
}

interface UserContextType {
    user: User | null;
    login: (username: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            setUser(JSON.parse(saved));
        }
    }, []);

    const login = (username: string) => {
        const mockUser: User = {
            id: 1,
            username,
            role: username === "admin" ? "Admin" : "Member",
            tenantId: 101,
        };
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
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

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside UserProvider");
    return ctx;
};
