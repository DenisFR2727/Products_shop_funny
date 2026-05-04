"use client";

import createTodo, { type CreateTodoState } from "@/actions/todo/create-todo";
import { useActionState, useEffect, useRef, useTransition } from "react";
import Input from "../products/cart/orders/input/input";
import styles from "./todo-list.module.scss";
import type { Todo } from "./types";

const initialTodoState: CreateTodoState = { errors: null };

type TodoFormProps = {
  addOptimistic: (todo: Todo) => void;
  onTodoCreated: (todo: Todo) => void;
};

export default function TodoForm({
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

  const inputStyles = {
    shipping_title: styles.formField,
    error: styles.fieldError,
  };

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

  const isPending = Boolean(isPendingAction) || isPendingTransition;

  return (
    <form className={styles.form} action={composedAction}>
      <div className={styles.formRow}>
        <Input
          id="todo-title"
          label="Title"
          type="text"
          name="title"
          placeholder="Add a new task"
          disabled={isPending}
          styles={inputStyles}
        />
        <button className={styles.addBtn} type="submit" disabled={isPending}>
          {isPending ? "…" : "Add"}
        </button>
      </div>
      {state.errors && state.errors.length > 0 && (
        <ul className={styles.errorList} role="alert">
          {state.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
