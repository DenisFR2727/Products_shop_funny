import { useState } from "react";
import { deleteTodoById } from "@/actions/todo/delete-todo";
import { withPendingId } from "../utils/with-pending-id";
import type { Todo, UseTodoParams } from "../types";

export function useTodoDelete({ optimisticTodos, updateTodos }: UseTodoParams) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteErrors, setDeleteErrors] = useState<string[] | null>(null);

  function restoreDeletedTodo(deletedTodo: Todo, index: number) {
    updateTodos((prev) => {
      const next = [...prev];
      const safeIndex = Math.min(index, next.length);
      next.splice(safeIndex, 0, deletedTodo);
      return next;
    });
  }

  async function handleDeleteRequest(
    id: string,
    deletedTodo: Todo,
    deletedTodoIndex: number,
  ) {
    await withPendingId(id, setPendingDeleteId, async () => {
      const result = await deleteTodoById(id);
      if (result.errors) {
        setDeleteErrors(result.errors);
        restoreDeletedTodo(deletedTodo, deletedTodoIndex);
      }
    });
  }

  function deleteTodoItem(id: string) {
    const deletedTodoIndex = optimisticTodos.findIndex(
      (todo) => todo.id === id,
    );
    const deletedTodo =
      deletedTodoIndex === -1 ? null : optimisticTodos[deletedTodoIndex];

    if (!deletedTodo) return;

    updateTodos((prev) => prev.filter((todo) => todo.id !== id));
    setDeleteErrors(null);

    if (id.startsWith("optimistic-")) return;
    void handleDeleteRequest(id, deletedTodo, deletedTodoIndex);
  }

  return {
    pendingDeleteId,
    deleteErrors,
    deleteTodoItem,
  };
}
