// src/AppWrapper.tsx
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TaskProvider } from "./contexts/TaskContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import { UserProvider } from "./contexts/UserProvider";

export default function AppWrapper() {
    return (
        <BrowserRouter>
            <UserProvider>
                <ProjectProvider>
                    <TaskProvider>
                        <App />
                    </TaskProvider>
                </ProjectProvider>
            </UserProvider>
        </BrowserRouter>
    );
}
