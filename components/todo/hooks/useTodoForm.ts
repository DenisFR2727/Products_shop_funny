import createTodo, { CreateTodoState } from "@/actions/todo/create-todo";
import { useActionState, useEffect, useRef, useTransition } from "react";
import type { OptimisticTodo, TodoFormHookParams } from "../types";

const initialTodoState: CreateTodoState = { errors: null };

export default function useTodoForm({
  addOptimistic,
  onTodoCreated,
}: TodoFormHookParams) {
  const [state, formAction, isPendingAction] = useActionState(
    createTodo,
    initialTodoState,
  );
  const [isPendingTransition, startTransition] = useTransition();
  const prevTodoIdRef = useRef<string | undefined>(undefined);
  const pendingOptimisticIdRef = useRef<string | null>(null);

  useEffect(() => {
    const id = state.todo?.id;
    if (!id || id === prevTodoIdRef.current) return;

    prevTodoIdRef.current = id;
    onTodoCreated(state.todo!, pendingOptimisticIdRef.current);
    pendingOptimisticIdRef.current = null;
  }, [state.todo, onTodoCreated]);

  function composedAction(formData: FormData) {
    const raw = formData.get("title");
    const title = typeof raw === "string" ? raw.trim() : "";

    startTransition(() => {
      if (title) {
        const optimisticId = `optimistic-${crypto.randomUUID()}` as const;
        pendingOptimisticIdRef.current = optimisticId;
        addOptimistic({ id: optimisticId, title });
      } else {
        pendingOptimisticIdRef.current = null;
      }
      formAction(formData);
    });
  }

  return {
    isPendingTransition,
    composedAction,
    isPendingAction,
    state,
  };
}
