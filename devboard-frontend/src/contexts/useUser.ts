import { useContext } from "react";
import { UserContext } from "./UserContext";

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside UserProvider");
    return ctx;
};
