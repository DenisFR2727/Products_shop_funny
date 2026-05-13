"use client";

import { FaSpinner, FaTrash } from "react-icons/fa";
import type { Todo } from "./types";
import styles from "./todo-list.module.scss";

export type TodoListItemProps = {
  todo: Todo;
  draftTitle: string;
  pendingDeleteId: string | null;
  pendingEditId: string | null;
  editingTodoId: string | null;
  onDelete: (id: string) => void;
  onEditOrSave: (id: string, currentDraftTitle: string) => void;
};

export default function TodoListItem({
  todo,
  draftTitle,
  pendingDeleteId,
  pendingEditId,
  editingTodoId,
  onDelete,
  onEditOrSave,
}: TodoListItemProps) {
  const id = todo.id;
  const isDeletePending = pendingDeleteId === id;
  const isEditPending = pendingEditId === id;
  const isRowSaveMode = editingTodoId === id;
  const isOptimisticRow = id.startsWith("optimistic-");

  return (
    <li className={styles.listItem}>
      <span className={styles.listItemText}>{todo.title}</span>
      <button
        type="button"
        className={styles.deleteBtn}
        aria-label="Delete task"
        disabled={isDeletePending}
        onClick={() => onDelete(id)}
      >
        {isDeletePending ? <FaSpinner aria-hidden /> : <FaTrash aria-hidden />}
      </button>
      <button
        type="button"
        className={isRowSaveMode ? styles.saveBtn : styles.editBtn}
        aria-label={isRowSaveMode ? "Save task" : "Edit task"}
        disabled={isDeletePending || Boolean(pendingEditId) || isOptimisticRow}
        onClick={() => onEditOrSave(id, draftTitle)}
      >
        {isEditPending ? (
          <FaSpinner aria-hidden />
        ) : isRowSaveMode ? (
          <span>Save</span>
        ) : (
          <span>Edit</span>
        )}
      </button>
    </li>
  );
}
