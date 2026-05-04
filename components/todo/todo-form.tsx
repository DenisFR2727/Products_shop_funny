"use client";

import Input from "../products/cart/orders/input/input";
import styles from "./todo-list.module.scss";
import type { TodoFormProps } from "./types";
import useTodoForm from "./hooks/useTodoForm";

export default function TodoForm({
  addOptimistic,
  onTodoCreated,
}: TodoFormProps) {
  const { isPendingTransition, composedAction, isPendingAction, state } =
    useTodoForm({
      addOptimistic,
      onTodoCreated,
    });

  const inputStyles = {
    shipping_title: styles.formField,
    error: styles.fieldError,
  };
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
