"use client";

import { useCallback, useMemo, useState } from "react";
import { useTodoDelete } from "./hooks/useTodoDelete";
import TodoForm from "./todo-form";
import useOptimisticTodoList from "./hooks/useOptimisticTodoList";
import useTodoEdit from "./hooks/useTodoEdit";
import { useTodoComplete } from "./hooks/useTodoComplete";
import useTodoForm from "./hooks/useTodoForm";
import TodoErrorsList from "./utils/todo-errors-list";
import { mergeTodoErrors } from "./utils/merge-todo-errors";
import TodoListItem from "./todo-list-item";
import type { Todo } from "./types";
import styles from "./todo-list.module.scss";

export default function TodoList() {
  const [title, setTitle] = useState("");

  const {
    optimisticTodos,
    addOptimistic,
    confirmTodo,
    updateTodos,
    loading,
    error,
  } = useOptimisticTodoList();
  const { pendingDeleteId, deleteErrors, deleteTodoItem } = useTodoDelete({
    optimisticTodos,
    updateTodos,
  });
  const {
    editingTodoId,
    editingTitle,
    setEditingTitle,
    pendingEditId,
    editErrors,
    editTodoItem,
  } = useTodoEdit({ updateTodos });
  const { pendingCompleteId, completeErrors, toggleComplete } = useTodoComplete(
    {
      updateTodos,
    },
  );

  const handleTodoCreated = useCallback(
    (todo: Todo, optimisticId: string | null) => {
      confirmTodo(optimisticId, todo);
      setTitle("");
    },
    [confirmTodo],
  );

  const { isPendingTransition, composedAction, isPendingAction, state } =
    useTodoForm({
      addOptimistic,
      onTodoCreated: handleTodoCreated,
    });

  const isFormPending = Boolean(isPendingAction) || isPendingTransition;

  const mutationErrors = useMemo(
    () =>
      mergeTodoErrors(state.errors, deleteErrors, editErrors, completeErrors),
    [state.errors, deleteErrors, editErrors, completeErrors],
  );

  const listItemProps = {
    activeEditId: editingTodoId,
    editTitle: editingTitle,
    onEditTitleChange: setEditingTitle,
    pendingDeleteId,
    pendingEditId,
    pendingCompleteId,
    onDelete: deleteTodoItem,
    onEditSave: editTodoItem,
    onToggleComplete: toggleComplete,
  };

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <h1 className={styles.title}>Todo List</h1>
        {!loading && (
          <p className={styles.tasksCount}>Tasks: {optimisticTodos.length}</p>
        )}
        <TodoForm
          title={title}
          onTitleChange={setTitle}
          composedAction={composedAction}
          isPending={isFormPending}
        />
        <TodoErrorsList errors={mutationErrors} />
        {loading && <p className={styles.status}>Loading…</p>}
        {!loading && error && (
          <p className={styles.alert} role="alert">
            {error}
          </p>
        )}
        {!loading && !error && (
          <ul className={styles.list}>
            {optimisticTodos.length === 0 ? (
              <li className={styles.empty}>No tasks</li>
            ) : (
              optimisticTodos.map((todo) => (
                <TodoListItem key={todo.id} todo={todo} {...listItemProps} />
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
