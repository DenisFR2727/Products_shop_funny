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
};
