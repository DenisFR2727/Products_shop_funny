import createTodoPost from "@/lib/api/todo";
import { getServerSession } from "next-auth";

import createTodo from "../create-todo";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/api/todo", () => ({ __esModule: true, default: jest.fn() }));

const mockedSession = getServerSession as jest.Mock;
const mockedCreate = createTodoPost as jest.Mock;

describe("actions/todo/create-todo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects creation without an authenticated user", async () => {
    mockedSession.mockResolvedValue(null);
    const formData = new FormData();
    formData.set("title", "Task");

    const result = await createTodo({ errors: null }, formData);

    expect(result.errors).toEqual(["Authorization required"]);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("passes actor identity separately from the title payload", async () => {
    mockedSession.mockResolvedValue({ user: { id: "user-a" } });
    const todo = {
      id: "507f1f77bcf86cd799439011",
      title: "Task",
      userId: "user-a",
      createAt: "2026-07-24T00:00:00.000Z",
      completed: false,
    };
    mockedCreate.mockResolvedValue(todo);
    const formData = new FormData();
    formData.set("title", "  Task  ");

    const result = await createTodo({ errors: null }, formData);

    expect(mockedCreate).toHaveBeenCalledWith("user-a", { title: "Task" });
    expect(result).toEqual({ errors: null, todo });
  });
});
