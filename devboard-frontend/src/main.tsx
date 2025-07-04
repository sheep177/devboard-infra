import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper";
import { UserProvider } from "./contexts/UserProvider";
import { TaskProvider } from "./contexts/TaskContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <UserProvider>
            <TaskProvider>
                <AppWrapper />
            </TaskProvider>
        </UserProvider>
    </React.StrictMode>
);
