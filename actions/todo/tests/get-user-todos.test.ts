import { fetchTodosForUser } from "@/lib/api/todo";
import { getServerSession } from "next-auth";

import { getUserTodos } from "../get-user-todos";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/api/todo", () => ({
  fetchTodosForUser: jest.fn(),
  fetchTodoById: jest.fn(),
}));

const mockedSession = getServerSession as jest.Mock;
const mockedFetchTodos = fetchTodosForUser as jest.Mock;

describe("actions/todo/get-user-todos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads tasks with the verified session identity", async () => {
    const todos = [
      {
        id: "507f1f77bcf86cd799439011",
        title: "Task",
        userId: "user-a",
        completed: false,
      },
    ];
    mockedSession.mockResolvedValue({ user: { id: "user-a" } });
    mockedFetchTodos.mockResolvedValue(todos);

    await expect(getUserTodos()).resolves.toEqual({ todos, error: null });
    expect(mockedFetchTodos).toHaveBeenCalledWith("user-a");
  });

  it("returns an empty state for an owner without tasks", async () => {
    mockedSession.mockResolvedValue({ user: { id: "user-empty" } });
    mockedFetchTodos.mockResolvedValue([]);

    await expect(getUserTodos()).resolves.toEqual({ todos: [], error: null });
  });

  it("does not call the backend without a session", async () => {
    mockedSession.mockResolvedValue(null);

    await expect(getUserTodos()).resolves.toEqual({
      todos: [],
      error: "Authorization required",
    });
    expect(mockedFetchTodos).not.toHaveBeenCalled();
  });

  it("returns a safe message when the backend fails", async () => {
    mockedSession.mockResolvedValue({ user: { id: "user-a" } });
    mockedFetchTodos.mockRejectedValue(new Error("network"));

    await expect(getUserTodos()).resolves.toEqual({
      todos: [],
      error: "Failed to load tasks",
    });
  });
});
