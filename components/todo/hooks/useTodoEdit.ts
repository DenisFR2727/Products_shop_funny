import { useState } from "react";
import getTodoById from "@/actions/todo/get-todo-by-id";
import { updateTodoById } from "@/actions/todo/update-todo";
import { isOptimisticTodoId } from "../types";
import { withPendingId } from "../utils/with-pending-id";
import type { UseTodoEditParams } from "../types";

export default function useTodoEdit({ updateTodos }: UseTodoEditParams) {
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<string[] | null>(null);

  async function startEdit(id: string) {
    setEditErrors(null);
    await withPendingId(id, setPendingEditId, async () => {
      const result = await getTodoById(id);
      if (result.errors) {
        setEditErrors(result.errors);
        return;
      }
      if (result.todo) {
        setEditingTitle(result.todo.title);
        setEditingTodoId(id);
      }
    });
  }

  async function saveEdit(id: string, newTitle: string) {
    const trimmed = newTitle.trim();

    setEditErrors(null);

    if (!trimmed) {
      setEditErrors(["Title is required"]);
      return;
    }

    await withPendingId(id, setPendingEditId, async () => {
      const result = await updateTodoById(id, trimmed);
      if (result.errors) {
        setEditErrors(result.errors);
        return;
      }
      if (result.todo) {
        updateTodos((prev) =>
          prev.map((t) => (t.id === id ? result.todo! : t)),
        );
      }
      setEditingTodoId(null);
      setEditingTitle("");
    });
  }

  function editTodoItem(id: string) {
    if (isOptimisticTodoId(id)) return;
    if (pendingEditId) return;

    if (editingTodoId === id) {
      void saveEdit(id, editingTitle);
      return;
    }

    setEditingTodoId(null);
    setEditingTitle("");
    void startEdit(id);
  }

  return {
    editingTodoId,
    editingTitle,
    setEditingTitle,
    pendingEditId,
    editErrors,
    editTodoItem,
  };
}
