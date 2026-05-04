"use client";

import { FaTrash } from "react-icons/fa";
import TodoForm from "./todo-form";
import useOptimisticTodoList from "./hooks/useOptimisticTodoList";
import styles from "./todo-list.module.scss";

export default function TodoList() {
  const { optimisticTodos, addOptimistic, appendTodo, loading, error } =
    useOptimisticTodoList();

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <h1 className={styles.title}>Todo List</h1>
        <TodoForm addOptimistic={addOptimistic} onTodoCreated={appendTodo} />
        {loading && <p className={styles.status}>Завантаження…</p>}
        {!loading && error && (
          <p className={styles.alert} role="alert">
            {error}
          </p>
        )}
        {!loading && !error && (
          <ul className={styles.list}>
            {optimisticTodos.length === 0 ? (
              <li className={styles.empty}>Немає завдань</li>
            ) : (
              optimisticTodos.map((todo) => (
                <li key={todo.id} className={styles.listItem}>
                  <span className={styles.listItemText}>{todo.title}</span>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    aria-label="Delete task"
                  >
                    <FaTrash aria-hidden />
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
