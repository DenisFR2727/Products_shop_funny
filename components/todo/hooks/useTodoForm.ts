import createTodo, { CreateTodoState } from "@/actions/todo/create-todo";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { TodoFormProps } from "../types";

const initialTodoState: CreateTodoState = { errors: null };

export default function useTodoForm({
  addOptimistic,
  onTodoCreated,
}: TodoFormProps) {
  const [state, formAction, isPendingAction] = useActionState(
    createTodo,
    initialTodoState,
  );
  const [isPendingTransition, startTransition] = useTransition();
  const prevTodoIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const id = state.todo?.id;
    if (!id || id === prevTodoIdRef.current) return;

    prevTodoIdRef.current = id;
    onTodoCreated(state.todo!);
  }, [state.todo, onTodoCreated]);

  function composedAction(formData: FormData) {
    const raw = formData.get("title");
    const title = typeof raw === "string" ? raw.trim() : "";

    startTransition(() => {
      if (title) {
        addOptimistic({
          id: `optimistic-${crypto.randomUUID()}`,
          title,
          userId: "",
        });
      }
      formAction(formData);
    });
  }

  return {
    isPendingTransition,
    addOptimistic,
    onTodoCreated,
    composedAction,
    isPendingAction,
    state,
  };
}
