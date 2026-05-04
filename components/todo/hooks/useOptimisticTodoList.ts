import { getUserTodos } from "@/actions/todo/get-user-todos";
import useOptimisticList from "./useOptimisticList";
import type { Todo } from "../types";

/**
 * Готовий пресет для todo: той самий API, що раніше ({ optimisticTodos, appendTodo, … }).
 */
export default function useOptimisticTodoList() {
  const { optimisticItems, addOptimistic, appendItem, reload, loading, error } =
    useOptimisticList<Todo>({
      queryFn: async () => {
        const r = await getUserTodos();
        return { data: r.todos, error: r.error };
      },
    });

  return {
    optimisticTodos: optimisticItems,
    addOptimistic,
    appendTodo: appendItem,
    reloadTodos: reload,
    loading,
    error,
  };
}
