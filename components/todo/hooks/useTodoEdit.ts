import { useState } from "react";
import getTodoById from "@/actions/todo/get-todo-by-id";
import { updateTodoById } from "@/actions/todo/update-todo";
import { withPendingId } from "../utils/with-pending-id";
import type { UseTodoEditParams } from "../types";

export default function useTodoEdit({
  updateTodos,
  setFormTitle,
}: UseTodoEditParams) {
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
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
        setFormTitle(result.todo.title);
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
        setFormTitle("");
      }
      setEditingTodoId(null);
    });
  }

  function editTodoItem(id: string, currentTitle: string) {
    const isPersistedTask = !id.startsWith("optimistic-");

    if (pendingEditId) return;

    if (editingTodoId === id) {
      void saveEdit(id, currentTitle);
      return;
    }

    setEditingTodoId(null);
    if (!isPersistedTask) return;

    void startEdit(id);
  }

  return { editingTodoId, pendingEditId, editErrors, editTodoItem };
}
