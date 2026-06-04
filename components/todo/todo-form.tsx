"use client";

import LabeledInput from "@/components/ui/labeled-input";
import styles from "./todo-list.module.scss";
import type { TodoFormProps } from "./types";

export default function TodoForm({
  title,
  onTitleChange,
  composedAction,
  isPending,
}: TodoFormProps) {
  return (
    <form className={styles.form} action={composedAction}>
      <div className={styles.formRow}>
        <LabeledInput
          id="todo-title"
          label="Title"
          type="text"
          name="title"
          placeholder="Add a new task"
          disabled={isPending}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          styles={{
            field: styles.formField,
            error: styles.fieldError,
          }}
        />
        <button className={styles.addBtn} type="submit" disabled={isPending}>
          {isPending ? "…" : "Add"}
        </button>
      </div>
    </form>
  );
}
