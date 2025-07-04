import { useDroppable } from "@dnd-kit/core";
import BoardTaskCard from "./BoardTaskCard";
import type { Task } from "../types";

export default function DroppableColumn({
                                            id,
                                            title,
                                            tasks,
                                        }: {
    id: string;
    title: string;
    tasks: Task[];
}) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="bg-white rounded-xl shadow-md p-4 w-80 min-h-[300px]">
            <h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>
            <div ref={setNodeRef} className="space-y-3">
                {tasks.map((task) => (
                    <BoardTaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}
