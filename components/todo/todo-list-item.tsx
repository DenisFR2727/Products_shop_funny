"use client";

import { FaSpinner, FaTrash } from "react-icons/fa";
import type { TodoListItemProps } from "./types";
import { isOptimisticTodoId } from "./types";
import styles from "./todo-list.module.scss";

export default function TodoListItem({
  todo,
  editingTodoId,
  editingTitle,
  onEditingTitleChange,
  pendingDeleteId,
  pendingEditId,
  onDelete,
  onEditOrSave,
}: TodoListItemProps) {
  const id = todo.id;
  const isDeletePending = pendingDeleteId === id;
  const isEditPending = pendingEditId === id;
  const isRowSaveMode = editingTodoId === id;
  const isOptimisticRow = isOptimisticTodoId(id);

  return (
    <li className={styles.listItem}>
      {isRowSaveMode ? (
        <input
          className={styles.listItemInput}
          type="text"
          value={editingTitle}
          aria-label="Edit task title"
          disabled={isEditPending}
          onChange={(e) => onEditingTitleChange(e.target.value)}
        />
      ) : (
        <span className={styles.listItemText}>{todo.title}</span>
      )}
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
        onClick={() => onEditOrSave(id)}
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
