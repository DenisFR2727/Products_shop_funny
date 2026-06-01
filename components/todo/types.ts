export type Todo = {
  id: string;
  title: string;
  userId: string;
  createAt?: string;
  completed?: boolean;
};

/** Temporary row shown during create; never persisted as-is. */
export type OptimisticTodo = {
  id: `optimistic-${string}`;
  title: string;
};

export function isOptimisticTodoId(id: string): id is OptimisticTodo["id"] {
  return id.startsWith("optimistic-");
}

export function isPersistedTodo(entry: TodoListEntry): entry is Todo {
  return !isOptimisticTodoId(entry.id);
}

export type TodoDraft = Pick<Todo, "title" | "userId">;

export type TodoFormProps = {
  addOptimistic: (todo: OptimisticTodo) => void;
  onTodoCreated: (todo: Todo, optimisticId: string | null) => void;
  title: string;
  onTitleChange: (next: string) => void;
};

export type TodoListEntry = Todo | OptimisticTodo;

export type UseTodoParams = {
  optimisticTodos: TodoListEntry[];
  updateTodos: (updater: (prev: Todo[]) => Todo[]) => void;
};

export type UseTodoEditParams = {
  updateTodos: (updater: (prev: Todo[]) => Todo[]) => void;
};

export type TodoFormHookParams = Pick<
  TodoFormProps,
  "addOptimistic" | "onTodoCreated"
>;

export type TodoErrorsListProps = {
  errors: string[] | null | undefined;
};

export type TodoListItemProps = {
  todo: Pick<Todo, "id" | "title" | "completed">;
  editingTodoId: string | null;
  editingTitle: string;
  onEditingTitleChange: (next: string) => void;
  pendingDeleteId: string | null;
  pendingEditId: string | null;
  pendingCompleteId: string | null;
  onDelete: (id: string) => void;
  onEditOrSave: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
};
