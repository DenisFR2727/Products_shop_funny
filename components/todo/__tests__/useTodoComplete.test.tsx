import { act, renderHook, waitFor } from "@testing-library/react";
import { useTodoComplete } from "../hooks/useTodoComplete";
import { updateTodoCompletedById } from "@/actions/todo/update-todo";
import type { Todo } from "../types";

jest.mock("@/actions/todo/update-todo", () => ({
  updateTodoCompletedById: jest.fn(),
}));

const mockedUpdateTodoCompletedById =
  updateTodoCompletedById as jest.MockedFunction<
    typeof updateTodoCompletedById
  >;

const baseTodos: Todo[] = [
  {
    id: "1",
    title: "First",
    userId: "user-1",
    completed: false,
  },
  {
    id: "2",
    title: "Second",
    userId: "user-1",
    completed: true,
  },
];

describe("useTodoComplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("optimistically toggles completed and syncs server todo", async () => {
    const updated: Todo = { ...baseTodos[0], completed: true };
    mockedUpdateTodoCompletedById.mockResolvedValueOnce({
      errors: null,
      todo: updated,
    });

    let todos = [...baseTodos];
    const updateTodos = jest.fn((updater: (prev: Todo[]) => Todo[]) => {
      todos = updater(todos);
    });

    const { result } = renderHook(() => useTodoComplete({ updateTodos }));

    await act(async () => {
      await result.current.toggleComplete("1", true);
    });

    expect(todos.find((t) => t.id === "1")?.completed).toBe(true);
    expect(mockedUpdateTodoCompletedById).toHaveBeenCalledWith("1", true);
    expect(result.current.completeErrors).toBeNull();
  });

  it("rolls back optimistic update when server returns errors", async () => {
    mockedUpdateTodoCompletedById.mockResolvedValueOnce({
      errors: ["Server is unavailable. Please try again later."],
    });

    let todos = [...baseTodos];
    const updateTodos = jest.fn((updater: (prev: Todo[]) => Todo[]) => {
      todos = updater(todos);
    });

    const { result } = renderHook(() => useTodoComplete({ updateTodos }));

    await act(async () => {
      await result.current.toggleComplete("1", true);
    });

    expect(todos.find((t) => t.id === "1")?.completed).toBe(false);
    await waitFor(() => {
      expect(result.current.completeErrors).toEqual([
        "Server is unavailable. Please try again later.",
      ]);
    });
  });

  it("ignores optimistic todo ids", async () => {
    let todos = [...baseTodos];
    const updateTodos = jest.fn((updater: (prev: Todo[]) => Todo[]) => {
      todos = updater(todos);
    });

    const { result } = renderHook(() => useTodoComplete({ updateTodos }));

    await act(async () => {
      await result.current.toggleComplete("optimistic-1", true);
    });

    expect(mockedUpdateTodoCompletedById).not.toHaveBeenCalled();
    expect(updateTodos).not.toHaveBeenCalled();
    expect(todos).toEqual(baseTodos);
  });
});
