export type TodoListItemRowStateInput = {
  rowId: string;
  activeEditId: string | null;
  pendingDeleteId: string | null;
  pendingEditId: string | null;
  pendingCompleteId: string | null;
  isOptimisticRow: boolean;
};

export type TodoListItemRowState = {
  isEditing: boolean;
  isDeletePending: boolean;
  isEditPending: boolean;
  isCompletePending: boolean;
  disabled: {
    deleteButton: boolean;
    editTitleInput: boolean;
    editButton: boolean;
    completeCheckbox: boolean;
  };
};

export function getTodoListItemRowState(
  input: TodoListItemRowStateInput,
): TodoListItemRowState {
  const {
    rowId,
    activeEditId,
    pendingDeleteId,
    pendingEditId,
    pendingCompleteId,
    isOptimisticRow,
  } = input;

  const isEditing = activeEditId === rowId;
  const isDeletePending = pendingDeleteId === rowId;
  const isEditPending = pendingEditId === rowId;
  const isCompletePending = pendingCompleteId === rowId;
  const isAnotherRowEditing = Boolean(pendingEditId);

  return {
    isEditing,
    isDeletePending,
    isEditPending,
    isCompletePending,
    disabled: {
      deleteButton: isDeletePending,
      editTitleInput: isEditPending,
      editButton: isDeletePending || isAnotherRowEditing || isOptimisticRow,
      completeCheckbox: isOptimisticRow || isCompletePending,
    },
  };
}
