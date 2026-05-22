"use client";
import { useCallback, useState } from "react";
import { useTodoDelete } from "./hooks/useTodoDelete";
import TodoForm from "./todo-form";
import useOptimisticTodoList from "./hooks/useOptimisticTodoList";

import styles from "./todo-list.module.scss";
import useTodoEdit from "./hooks/useTodoEdit";
import TodoErrorsList from "./utils/todo-errors-list";
import TodoListItem from "./todo-list-item";
import type { Todo } from "./types";

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

  const handleTodoCreated = useCallback(
    (todo: Todo, optimisticId: string | null) => {
      confirmTodo(optimisticId, todo);
      setTitle("");
    },
    [confirmTodo],
  );

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <h1 className={styles.title}>Todo List</h1>
        {!loading && (
          <p className={styles.tasksCount}>Tasks: {optimisticTodos.length}</p>
        )}
        <TodoForm
          addOptimistic={addOptimistic}
          onTodoCreated={handleTodoCreated}
          title={title}
          onTitleChange={setTitle}
        />
        <TodoErrorsList errors={deleteErrors} />
        <TodoErrorsList errors={editErrors} />
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
                <TodoListItem
                  key={todo.id}
                  todo={todo}
                  editingTodoId={editingTodoId}
                  editingTitle={editingTitle}
                  onEditingTitleChange={setEditingTitle}
                  pendingDeleteId={pendingDeleteId}
                  pendingEditId={pendingEditId}
                  onDelete={deleteTodoItem}
                  onEditOrSave={editTodoItem}
                />
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
