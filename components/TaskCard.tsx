"use client";

import { Task } from "@/types/task";
import { useState } from "react";
import TaskForm from "./TaskForm";

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
  };

  const statusLabels = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <TaskForm
          initialData={{
            title: task.title,
            description: task.description || "",
            status: task.status,
          }}
          onSubmit={(updates) => {
            onUpdate(task.id, updates);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          submitLabel="Update Task"
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            statusColors[task.status]
          }`}
        >
          {statusLabels[task.status]}
        </span>
      </div>
      {task.description && (
        <p className="text-gray-600 mb-3">{task.description}</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
