import { Routes, Route } from "react-router-dom";
import AuthPanel from "./components/AuthPanel";
import TaskDetail from "./components/TaskDetail";
import BoardView from "./pages/BoardView";
import AdminPanel from "./pages/AdminPanel";
import MainPage from "./pages/MainPage";
import { useUser } from "./contexts/useUser";

export default function App() {
    const { user } = useUser();

    if (!user) return <AuthPanel />;

    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/project/:projectId" element={<MainPage />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/board" element={<BoardView />} />
            <Route path="/admin" element={<AdminPanel />} />
        </Routes>
    );
}
