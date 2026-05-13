"use client";
import { useCallback, useEffect, useState } from "react";
import { useTodoDelete } from "./hooks/useTodoDelete";
import TodoForm from "./todo-form";
import useOptimisticTodoList from "./hooks/useOptimisticTodoList";

import styles from "./todo-list.module.scss";
import TodoHeader from "./todo-header";
import useTodoEdit from "./hooks/useTodoEdit";
import TodoErrorsList from "./utils/todo-errors-list";
import TodoListItem from "./todo-list-item";
import type { Todo } from "./types";

export default function TodoList() {
  const [title, setTitle] = useState("");

  const {
    optimisticTodos,
    addOptimistic,
    appendTodo,
    updateTodos,
    loading,
    error,
    todosCount,
  } = useOptimisticTodoList();
  const { pendingDeleteId, deleteErrors, deleteTodoItem } = useTodoDelete({
    optimisticTodos,
    updateTodos,
  });
  const { editingTodoId, pendingEditId, editErrors, editTodoItem } =
    useTodoEdit({
      optimisticTodos,
      updateTodos,
      setFormTitle: setTitle,
    });

  const handleTodoCreated = useCallback(
    (todo: Todo) => {
      appendTodo(todo);
      setTitle("");
    },
    [appendTodo],
  );

  return (
    <div className={styles.shell}>
      <TodoHeader />
      <div className={styles.card}>
        <h1 className={styles.title}>Todo List</h1>
        <p className={styles.tasksCount}>tasks:{todosCount}</p>
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
                  draftTitle={title}
                  pendingDeleteId={pendingDeleteId}
                  pendingEditId={pendingEditId}
                  editingTodoId={editingTodoId}
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
