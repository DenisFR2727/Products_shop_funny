import { act, renderHook, waitFor } from "@testing-library/react";

import createTodo from "@/actions/todo/create-todo";

import useTodoForm from "../hooks/useTodoForm";

jest.mock("@/actions/todo/create-todo", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedCreateTodo = createTodo as jest.Mock;

describe("useTodoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(globalThis.crypto, "randomUUID")
      .mockReturnValue("00000000-0000-4000-8000-000000000000");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("adds one optimistic row and confirms it with the canonical task", async () => {
    const todo = {
      id: "507f1f77bcf86cd799439011",
      title: "Task",
      userId: "user-a",
      completed: false,
    };
    mockedCreateTodo.mockResolvedValue({ errors: null, todo });
    const addOptimistic = jest.fn();
    const onTodoCreated = jest.fn();
    const { result } = renderHook(() =>
      useTodoForm({ addOptimistic, onTodoCreated }),
    );
    const formData = new FormData();
    formData.set("title", "  Task  ");

    act(() => result.current.composedAction(formData));

    expect(addOptimistic).toHaveBeenCalledWith({
      id: "optimistic-00000000-0000-4000-8000-000000000000",
      title: "Task",
    });
    await waitFor(() => {
      expect(onTodoCreated).toHaveBeenCalledWith(
        todo,
        "optimistic-00000000-0000-4000-8000-000000000000",
      );
    });
  });

  it("does not confirm an optimistic row when creation fails", async () => {
    mockedCreateTodo.mockResolvedValue({ errors: ["Invalid task data"] });
    const addOptimistic = jest.fn();
    const onTodoCreated = jest.fn();
    const { result } = renderHook(() =>
      useTodoForm({ addOptimistic, onTodoCreated }),
    );
    const formData = new FormData();
    formData.set("title", "Task");

    act(() => result.current.composedAction(formData));

    await waitFor(() => {
      expect(result.current.state.errors).toEqual(["Invalid task data"]);
    });
    expect(onTodoCreated).not.toHaveBeenCalled();
  });
});
