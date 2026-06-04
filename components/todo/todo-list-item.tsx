"use client";

import { FaSpinner, FaTrash } from "react-icons/fa";
import type { TodoListItemProps } from "./types";
import { isOptimisticTodoId } from "./types";
import { getTodoListItemRowState } from "./utils/todo-list-item-row-state";
import styles from "./todo-list.module.scss";

export default function TodoListItem({
  todo,
  activeEditId,
  editTitle,
  onEditTitleChange,
  pendingDeleteId,
  pendingEditId,
  pendingCompleteId,
  onDelete,
  onEditSave,
  onToggleComplete,
}: TodoListItemProps) {
  const id = todo.id;
  const isCompleted = Boolean(todo.completed);

  const { isEditing, isDeletePending, isEditPending, isCompletePending, disabled } =
    getTodoListItemRowState({
      rowId: id,
      activeEditId,
      pendingDeleteId,
      pendingEditId,
      pendingCompleteId,
      isOptimisticRow: isOptimisticTodoId(id),
    });

  return (
    <li className={styles.listItem}>
      {isEditing ? (
        <input
          className={styles.listItemInput}
          type="text"
          value={editTitle}
          aria-label="Edit task title"
          disabled={disabled.editTitleInput}
          onChange={(e) => onEditTitleChange(e.target.value)}
        />
      ) : (
        <span className={styles.listItemText}>
          <span className={isCompleted ? styles.completedTodo : undefined}>
            {todo.title}
          </span>
        </span>
      )}
      <button
        type="button"
        className={styles.deleteBtn}
        aria-label="Delete task"
        disabled={disabled.deleteButton}
        onClick={() => onDelete(id)}
      >
        {isDeletePending ? <FaSpinner aria-hidden /> : <FaTrash aria-hidden />}
      </button>
      <button
        type="button"
        className={isEditing ? styles.saveBtn : styles.editBtn}
        aria-label={isEditing ? "Save task" : "Edit task"}
        disabled={disabled.editButton}
        onClick={() => onEditSave(id)}
      >
        {isEditPending ? (
          <FaSpinner aria-hidden />
        ) : isEditing ? (
          <span>Save</span>
        ) : (
          <span>Edit</span>
        )}
      </button>
      <label className={styles.completeBtn}>
        {isCompletePending ? (
          <FaSpinner aria-hidden />
        ) : (
          <input
            type="checkbox"
            checked={isCompleted}
            disabled={disabled.completeCheckbox}
            aria-label={
              isCompleted ? "Mark task incomplete" : "Mark task complete"
            }
            onChange={() => void onToggleComplete(id, !isCompleted)}
          />
        )}
      </label>
    </li>
  );
}
