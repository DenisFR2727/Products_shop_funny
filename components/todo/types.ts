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
  title: string;
  onTitleChange: (next: string) => void;
  composedAction: (formData: FormData) => void;
  isPending: boolean;
};

export type TodoListEntry = Todo | OptimisticTodo;

export type UseTodoParams = {
  optimisticTodos: TodoListEntry[];
  updateTodos: (updater: (prev: Todo[]) => Todo[]) => void;
};

export type UseTodoEditParams = {
  updateTodos: (updater: (prev: Todo[]) => Todo[]) => void;
};

export type TodoFormHookParams = {
  addOptimistic: (todo: OptimisticTodo) => void;
  onTodoCreated: (todo: Todo, optimisticId: string | null) => void;
};

export type TodoErrorsListProps = {
  errors: string[] | null | undefined;
};

export type TodoListItemProps = {
  todo: Pick<Todo, "id" | "title" | "completed">;
  activeEditId: string | null;
  editTitle: string;
  onEditTitleChange: (next: string) => void;
  pendingDeleteId: string | null;
  pendingEditId: string | null;
  pendingCompleteId: string | null;
  onDelete: (id: string) => void;
  onEditSave: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
};
