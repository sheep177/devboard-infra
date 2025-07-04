import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TaskProvider } from "./contexts/TaskContext";
import { UserProvider } from "./contexts/UserProvider";

export default function AppWrapper() {
    return (
        <BrowserRouter>
            <UserProvider>
                <TaskProvider>
                    <App />
                </TaskProvider>
            </UserProvider>
        </BrowserRouter>
    );
}
