// src/AppWrapper.tsx
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TaskProvider } from "./contexts/TaskContext";
import { UserProvider } from "./contexts/UserProvider";
import { ProjectProvider } from "./contexts/ProjectContext";

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
