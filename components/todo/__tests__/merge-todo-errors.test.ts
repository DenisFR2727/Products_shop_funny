import { mergeTodoErrors } from "../utils/merge-todo-errors";

describe("mergeTodoErrors", () => {
  it("returns null when all sources are empty", () => {
    expect(mergeTodoErrors(null, undefined, [])).toBeNull();
  });

  it("merges errors in order and dedupes by message", () => {
    expect(
      mergeTodoErrors(
        ["Title is required"],
        ["Title is required", "Authorization required"],
        null,
        ["Authorization required"],
      ),
    ).toEqual(["Title is required", "Authorization required"]);
  });
});
