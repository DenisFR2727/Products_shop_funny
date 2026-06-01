import {
  validateTodoCreate,
  validateTodoTitle,
} from "@/actions/todo/valid-todos";

describe("validateTodoTitle", () => {
  it("accepts a non-empty trimmed title", () => {
    expect(validateTodoTitle("  Buy milk  ")).toEqual({
      ok: true,
      title: "Buy milk",
    });
  });

  it("rejects empty and non-string titles", () => {
    expect(validateTodoTitle("   ")).toEqual({
      ok: false,
      errors: ["Title is required"],
    });
    expect(validateTodoTitle(null)).toEqual({
      ok: false,
      errors: ["Title is required"],
    });
  });
});

describe("validateTodoCreate", () => {
  it("returns title and userId when valid", () => {
    expect(validateTodoCreate("Task", "user-1")).toEqual({
      ok: true,
      title: "Task",
      userId: "user-1",
    });
  });

  it("collects validation errors for missing title and user", () => {
    const result = validateTodoCreate("", undefined);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Title is required");
      expect(result.errors).toContain("Потрібна авторизація");
    }
  });
});
