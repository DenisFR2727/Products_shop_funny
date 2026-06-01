import {
  isOptimisticTodoId,
  isPersistedTodo,
  type OptimisticTodo,
  type Todo,
} from "../types";

describe("todo types helpers", () => {
  describe("isOptimisticTodoId", () => {
    it("returns true for optimistic ids", () => {
      expect(isOptimisticTodoId("optimistic-abc")).toBe(true);
    });

    it("returns false for persisted ids", () => {
      expect(isOptimisticTodoId("13")).toBe(false);
      expect(isOptimisticTodoId("uuid-1")).toBe(false);
    });
  });

  describe("isPersistedTodo", () => {
    const persisted: Todo = {
      id: "1",
      title: "Task",
      userId: "user-1",
      completed: false,
    };

    const optimistic: OptimisticTodo = {
      id: "optimistic-1",
      title: "Draft",
    };

    it("narrows optimistic entries out", () => {
      expect(isPersistedTodo(optimistic)).toBe(false);
    });

    it("narrows persisted todos in", () => {
      expect(isPersistedTodo(persisted)).toBe(true);
      if (isPersistedTodo(persisted)) {
        expect(persisted.userId).toBe("user-1");
      }
    });
  });
});
