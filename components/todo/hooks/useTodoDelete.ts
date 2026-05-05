import { useState } from "react";
import { deleteTodoById } from "@/actions/todo/delete-todo";
import type { Todo } from "../types";

type UseTodoDeleteParams = {
  optimisticTodos: Todo[];
  updateTodos: (updater: (prev: Todo[]) => Todo[]) => void;
};

export function useTodoDelete({
  optimisticTodos,
  updateTodos,
}: UseTodoDeleteParams) {
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
    setPendingDeleteId(id);
    try {
      const result = await deleteTodoById(id);
      if (result.errors) {
        setDeleteErrors(result.errors);
        restoreDeletedTodo(deletedTodo, deletedTodoIndex);
      }
    } finally {
      setPendingDeleteId((prev) => (prev === id ? null : prev));
    }
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
