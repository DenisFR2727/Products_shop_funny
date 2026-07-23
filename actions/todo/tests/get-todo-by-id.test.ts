import { fetchTodoById } from "@/lib/api/todo";
import { getServerSession } from "next-auth";

import { getTodoById } from "../get-todo-by-id";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/api/todo", () => ({
  fetchTodoById: jest.fn(),
}));

const mockedSession = getServerSession as jest.Mock;
const mockedFetchTodo = fetchTodoById as jest.Mock;

describe("actions/todo/get-todo-by-id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSession.mockResolvedValue({ user: { id: "user-1" } });
  });

  it("loads a todo using the verified actor identity", async () => {
    const todo = {
      id: "507f1f77bcf86cd799439011",
      title: "Task",
      userId: "user-1",
      completed: false,
    };
    mockedFetchTodo.mockResolvedValue(todo);

    await expect(getTodoById(todo.id)).resolves.toEqual({
      errors: null,
      todo,
    });
    expect(mockedFetchTodo).toHaveBeenCalledWith(todo.id, "user-1");
  });

  it("rejects a foreign task returned by a malformed backend", async () => {
    mockedFetchTodo.mockResolvedValue({
      id: "507f1f77bcf86cd799439011",
      title: "Foreign",
      userId: "user-2",
      completed: false,
    });

    await expect(
      getTodoById("507f1f77bcf86cd799439011"),
    ).resolves.toEqual({ errors: ["Todo not found"] });
  });
});
