import { useState } from "react";
import { updateTodoCompletedById } from "@/actions/todo/update-todo";
import { isOptimisticTodoId, type UseTodoEditParams } from "../types";
import { withPendingId } from "../utils/with-pending-id";

export function useTodoComplete({ updateTodos }: UseTodoEditParams) {
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(
    null,
  );
  const [completeErrors, setCompleteErrors] = useState<string[] | null>(null);

  async function toggleComplete(id: string, nextCompleted: boolean) {
    if (isOptimisticTodoId(id)) return;

    updateTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t)),
    );
    setCompleteErrors(null);

    await withPendingId(id, setPendingCompleteId, async () => {
      const result = await updateTodoCompletedById(id, nextCompleted);
      if (result.errors) {
        setCompleteErrors(result.errors);
        updateTodos((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: !nextCompleted } : t,
          ),
        );
        return;
      }
      if (result.todo) {
        updateTodos((prev) =>
          prev.map((t) => (t.id === id ? result.todo! : t)),
        );
      }
    });
  }

  return {
    pendingCompleteId,
    completeErrors,
    toggleComplete,
  };
}
