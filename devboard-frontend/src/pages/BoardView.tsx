import { useTasks } from "../contexts/TaskContext";
import {closestCenter, DndContext} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import DroppableColumn from "../components/DroppableColumn.tsx";
import api from "../api.ts";
import {useNavigate} from "react-router-dom";

export default function BoardView() {
    const { tasks, setTasks, fetchTasks } = useTasks();
    const navigate = useNavigate();

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = parseInt(active.id);
        const targetStatus = over.id;

        const updatedTasks = tasks.map((task) =>
            task.id === taskId ? { ...task, status: targetStatus } : task
        );
        setTasks(updatedTasks);

        try {
            await api.patch(`/tasks/${taskId}`, { status: targetStatus });
            await fetchTasks(); // 保证状态同步
        } catch (err) {
            console.error("Failed to update task status:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-700">🗂️ Board View</h2>
                <button
                    onClick={() => navigate("/")}
                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    ← Back to Main Page
                </button>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex justify-center gap-4">
                    {["ToDo", "InProgress", "Done"].map((status) => (
                        <SortableContext
                            key={status}
                            items={tasks.filter((t) => t.status === status).map((t) => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <DroppableColumn
                                id={status}
                                title={
                                    status === "InProgress"
                                        ? "In Progress"
                                        : status === "ToDo"
                                            ? "To Do"
                                            : "Done"
                                }
                                tasks={tasks.filter((t) => t.status === status)}
                            />
                        </SortableContext>
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
