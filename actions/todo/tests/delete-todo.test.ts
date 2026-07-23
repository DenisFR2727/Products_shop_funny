import { deleteTodoById } from "../delete-todo";
import { deleteTodoTask, fetchTodoById } from "@/lib/api/todo";
import { getServerSession } from "next-auth";
import { ApiError } from "@/lib/api/error";

jest.mock("@/lib/api/todo", () => ({
  fetchTodoById: jest.fn(),
  deleteTodoTask: jest.fn(),
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedFetchTodoById = fetchTodoById as jest.Mock;
const mockedDeleteTodoTask = deleteTodoTask as jest.Mock;

const session = { user: { id: "user-1" } };

const existingTodo = {
  id: "13",
  title: "Task",
  userId: "user-1",
  completed: false,
};

describe("actions/todo/delete-todo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetServerSession.mockResolvedValue(session);
    mockedFetchTodoById.mockResolvedValue(existingTodo);
    mockedDeleteTodoTask.mockResolvedValue(existingTodo);
  });

  it("returns error when todo id is missing", async () => {
    const result = await deleteTodoById("");

    expect(result.errors).toEqual(["Todo id is required"]);
    expect(mockedGetServerSession).not.toHaveBeenCalled();
  });

  it("returns error when user is not authorized", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);

    const result = await deleteTodoById("13");

    expect(result.errors).toEqual(["Authorization required"]);
    expect(mockedFetchTodoById).not.toHaveBeenCalled();
  });

  it("returns error for optimistic todo ids", async () => {
    const result = await deleteTodoById("optimistic-abc");

    expect(result.errors).toEqual(["Save the task before updating"]);
    expect(mockedFetchTodoById).not.toHaveBeenCalled();
  });

  it("deletes todo for owner", async () => {
    const result = await deleteTodoById("13");

    expect(mockedFetchTodoById).toHaveBeenCalledWith("13", "user-1");
    expect(mockedDeleteTodoTask).toHaveBeenCalledWith("13", "user-1");
    expect(result).toEqual({ errors: null, deletedId: "13" });
  });

  it("returns not found when todo belongs to another user", async () => {
    mockedFetchTodoById.mockResolvedValueOnce({
      ...existingTodo,
      userId: "other-user",
    });

    const result = await deleteTodoById("13");

    expect(result.errors).toEqual(["Todo not found"]);
    expect(mockedDeleteTodoTask).not.toHaveBeenCalled();
  });

  it("maps ApiError 404 to refresh message", async () => {
    mockedFetchTodoById.mockRejectedValueOnce(new ApiError(404, "missing"));

    const result = await deleteTodoById("13");

    expect(result.errors).toEqual([
      "Todo not found. Please refresh the list.",
    ]);
    expect(mockedDeleteTodoTask).not.toHaveBeenCalled();
  });

  it("returns generic error for unexpected failures on delete", async () => {
    mockedDeleteTodoTask.mockRejectedValueOnce(new Error("network"));

    const result = await deleteTodoById("13");

    expect(result.errors).toEqual([
      "Server is unavailable. Please try again later.",
    ]);
  });
});
