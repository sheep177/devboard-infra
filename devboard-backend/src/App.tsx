// src/App.tsx
import { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

function App() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div>
            <h1>DevBoard</h1>
            <TaskForm onTaskCreated={() => setRefreshKey((k) => k + 1)} />
            <TaskList key={refreshKey} />
        </div>
    );
}

export default App;
