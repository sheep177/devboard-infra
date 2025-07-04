import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types";

export default function BoardTaskCard({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const statusColor = {
        ToDo: "gray",
        InProgress: "blue",
        Done: "green",
    }[task.status];

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="p-3 rounded-xl bg-gray-50 border border-gray-300 shadow-sm cursor-grab hover:bg-gray-100"
        >
            <h4 className="text-sm font-semibold text-gray-800">{task.title}</h4>
            <p className="text-xs text-gray-600 truncate">{task.description}</p>
            <span className={`inline-block mt-2 text-xs font-medium text-${statusColor}-600`}>
        {task.status}
      </span>
        </div>
    );
}
