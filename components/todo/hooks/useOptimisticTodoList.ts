import { getUserTodos } from "@/actions/todo/get-user-todos";
import useOptimisticList from "./useOptimisticList";
import type { OptimisticTodo, Todo } from "../types";

export default function useOptimisticTodoList() {
  const {
    optimisticItems,
    addOptimistic,
    confirmItem,
    updateItems,
    loading,
    error,
  } = useOptimisticList<Todo | OptimisticTodo>({
    queryFn: async () => {
      const r = await getUserTodos();
      return { data: r.todos, error: r.error };
    },
  });

  const addOptimisticTodo = (todo: OptimisticTodo) => {
    addOptimistic(todo);
  };

  return {
    optimisticTodos: optimisticItems,
    addOptimistic: addOptimisticTodo,
    confirmTodo: (optimisticId: string | null, todo: Todo) =>
      confirmItem(optimisticId, todo),
    updateTodos: updateItems as (updater: (prev: Todo[]) => Todo[]) => void,
    loading,
    error,
  };
}
