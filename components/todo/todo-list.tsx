"use client";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { useTodoDelete } from "./hooks/useTodoDelete";
import TodoForm from "./todo-form";
import useOptimisticTodoList from "./hooks/useOptimisticTodoList";

import styles from "./todo-list.module.scss";

export default function TodoList() {
  const {
    optimisticTodos,
    addOptimistic,
    appendTodo,
    updateTodos,
    loading,
    error,
  } = useOptimisticTodoList();
  const { pendingDeleteId, deleteErrors, deleteTodoItem } = useTodoDelete({
    optimisticTodos,
    updateTodos,
  });

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <h1 className={styles.title}>Todo List</h1>
        <TodoForm addOptimistic={addOptimistic} onTodoCreated={appendTodo} />
        {deleteErrors && deleteErrors.length > 0 && (
          <ul className={styles.errorList} role="alert">
            {deleteErrors.map((deleteError, index) => (
              <li key={index}>{deleteError}</li>
            ))}
          </ul>
        )}
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
              optimisticTodos.map((todo) => {
                const isDeletePending = pendingDeleteId === todo.id;
                return (
                  <li key={todo.id} className={styles.listItem}>
                    <span className={styles.listItemText}>{todo.title}</span>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      aria-label="Delete task"
                      disabled={isDeletePending}
                      onClick={() => deleteTodoItem(todo.id)}
                    >
                      {isDeletePending ? (
                        <FaSpinner aria-hidden />
                      ) : (
                        <FaTrash aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
