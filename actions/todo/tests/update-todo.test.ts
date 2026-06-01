import {
  updateTodoById,
  updateTodoCompletedById,
} from "../update-todo";
import { fetchTodoById, updateTodoPatch } from "@/lib/api/todo";
import { getServerSession } from "next-auth";
import { ApiError } from "@/lib/api/error";

jest.mock("@/lib/api/todo", () => ({
  fetchTodoById: jest.fn(),
  updateTodoPatch: jest.fn(),
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

const mockedGetServerSession = getServerSession as jest.Mock;
const mockedFetchTodoById = fetchTodoById as jest.Mock;
const mockedUpdateTodoPatch = updateTodoPatch as jest.Mock;

const session = { user: { id: "user-1" } };

const existingTodo = {
  id: "13",
  title: "Task",
  userId: "user-1",
  completed: false,
};

describe("actions/todo/update-todo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetServerSession.mockResolvedValue(session);
    mockedFetchTodoById.mockResolvedValue(existingTodo);
  });

  describe("updateTodoById", () => {
    it("returns error when todo id is missing", async () => {
      const result = await updateTodoById("", "Title");

      expect(result.errors).toEqual(["Todo id is required"]);
      expect(mockedGetServerSession).not.toHaveBeenCalled();
    });

    it("returns error when user is not authorized", async () => {
      mockedGetServerSession.mockResolvedValueOnce(null);

      const result = await updateTodoById("13", "Title");

      expect(result.errors).toEqual(["Authorization required"]);
    });

    it("returns error for optimistic todo ids", async () => {
      const result = await updateTodoById("optimistic-abc", "Title");

      expect(result.errors).toEqual(["Save the task before updating"]);
      expect(mockedFetchTodoById).not.toHaveBeenCalled();
    });

    it("returns validation error for empty title", async () => {
      const result = await updateTodoById("13", "   ");

      expect(result.errors).toEqual(["Title is required"]);
      expect(mockedFetchTodoById).not.toHaveBeenCalled();
    });

    it("updates title for owner", async () => {
      const updated = { ...existingTodo, title: "New title" };
      mockedUpdateTodoPatch.mockResolvedValueOnce(updated);

      const result = await updateTodoById("13", "  New title  ");

      expect(mockedUpdateTodoPatch).toHaveBeenCalledWith("13", {
        title: "New title",
      });
      expect(result).toEqual({ errors: null, todo: updated });
    });

    it("returns not found when todo belongs to another user", async () => {
      mockedFetchTodoById.mockResolvedValueOnce({
        ...existingTodo,
        userId: "other-user",
      });

      const result = await updateTodoById("13", "Title");

      expect(result.errors).toEqual(["Todo not found"]);
      expect(mockedUpdateTodoPatch).not.toHaveBeenCalled();
    });

    it("maps ApiError 404 to refresh message", async () => {
      mockedFetchTodoById.mockRejectedValueOnce(new ApiError(404, "missing"));

      const result = await updateTodoById("13", "Title");

      expect(result.errors).toEqual([
        "Todo not found. Please refresh the list.",
      ]);
    });

    it("returns generic error for unexpected failures", async () => {
      mockedFetchTodoById.mockRejectedValueOnce(new Error("network"));

      const result = await updateTodoById("13", "Title");

      expect(result.errors).toEqual([
        "Server is unavailable. Please try again later.",
      ]);
    });
  });

  describe("updateTodoCompletedById", () => {
    it("returns error when todo id is missing", async () => {
      const result = await updateTodoCompletedById("", true);

      expect(result.errors).toEqual(["Todo id is required"]);
    });

    it("returns error when user is not authorized", async () => {
      mockedGetServerSession.mockResolvedValueOnce(null);

      const result = await updateTodoCompletedById("13", true);

      expect(result.errors).toEqual(["Authorization required"]);
    });

    it("returns error for optimistic ids", async () => {
      const result = await updateTodoCompletedById("optimistic-1", true);

      expect(result.errors).toEqual(["Save the task before updating"]);
      expect(mockedFetchTodoById).not.toHaveBeenCalled();
    });

    it("updates completed flag for owner", async () => {
      const updated = { ...existingTodo, completed: true };
      mockedUpdateTodoPatch.mockResolvedValueOnce(updated);

      const result = await updateTodoCompletedById("13", true);

      expect(mockedUpdateTodoPatch).toHaveBeenCalledWith("13", {
        completed: true,
      });
      expect(result).toEqual({ errors: null, todo: updated });
    });

    it("returns not found when todo belongs to another user", async () => {
      mockedFetchTodoById.mockResolvedValueOnce({
        ...existingTodo,
        userId: "other-user",
      });

      const result = await updateTodoCompletedById("13", false);

      expect(result.errors).toEqual(["Todo not found"]);
      expect(mockedUpdateTodoPatch).not.toHaveBeenCalled();
    });

    it("maps ApiError 404 to refresh message", async () => {
      mockedFetchTodoById.mockRejectedValueOnce(new ApiError(404, "missing"));

      const result = await updateTodoCompletedById("13", false);

      expect(result.errors).toEqual([
        "Todo not found. Please refresh the list.",
      ]);
    });
  });
});
