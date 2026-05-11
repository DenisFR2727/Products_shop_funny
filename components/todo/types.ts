export type Todo = {
  id: string;
  title: string;
  userId: string;
  createAt?: string;
};

export type TodoDraft = Pick<Todo, "title" | "userId">;

export type TodoFormProps = {
  addOptimistic: (todo: Todo) => void;
  onTodoCreated: (todo: Todo) => void;
  title: string;
  onTitleChange: (next: string) => void;
};

export type UseTodoParams = {
  optimisticTodos: Todo[];
  updateTodos: (updater: (prev: Todo[]) => Todo[]) => void;
};

export type UseTodoEditParams = UseTodoParams & {
  setFormTitle: (title: string) => void;
};

export type TodoFormHookParams = Pick<
  TodoFormProps,
  "addOptimistic" | "onTodoCreated"
>;

export type TodoErrorsListProps = {
  errors: string[] | null | undefined;
};
