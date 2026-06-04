import { getTodoListItemRowState } from "../utils/todo-list-item-row-state";

describe("getTodoListItemRowState", () => {
  const base = {
    rowId: "1",
    activeEditId: null as string | null,
    pendingDeleteId: null as string | null,
    pendingEditId: null as string | null,
    pendingCompleteId: null as string | null,
    isOptimisticRow: false,
  };

  it("disables edit button when another row has pending edit", () => {
    const state = getTodoListItemRowState({
      ...base,
      pendingEditId: "2",
    });

    expect(state.disabled.editButton).toBe(true);
    expect(state.isEditing).toBe(false);
  });

  it("disables complete checkbox for optimistic rows", () => {
    const state = getTodoListItemRowState({
      ...base,
      isOptimisticRow: true,
    });

    expect(state.disabled.completeCheckbox).toBe(true);
  });

  it("marks row as editing when activeEditId matches", () => {
    const state = getTodoListItemRowState({
      ...base,
      activeEditId: "1",
    });

    expect(state.isEditing).toBe(true);
    expect(state.disabled.editTitleInput).toBe(false);
  });
});
