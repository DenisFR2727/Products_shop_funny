import { fireEvent, render, screen } from "@testing-library/react";
import TodoListItem from "../todo-list-item";
import type { TodoListItemProps } from "../types";

jest.mock("react-icons/fa", () => ({
  FaSpinner: () => <span data-testid="spinner" />,
  FaTrash: () => <span data-testid="trash-icon" />,
}));

const baseProps: TodoListItemProps = {
  todo: { id: "1", title: "Buy milk", completed: false },
  activeEditId: null,
  editTitle: "",
  onEditTitleChange: jest.fn(),
  pendingDeleteId: null,
  pendingEditId: null,
  pendingCompleteId: null,
  onDelete: jest.fn(),
  onEditSave: jest.fn(),
  onToggleComplete: jest.fn(),
};

describe("TodoListItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders task title in view mode", () => {
    render(<TodoListItem {...baseProps} />);

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("calls onToggleComplete when checkbox changes", () => {
    render(<TodoListItem {...baseProps} />);

    fireEvent.click(screen.getByRole("checkbox"));

    expect(baseProps.onToggleComplete).toHaveBeenCalledWith("1", true);
  });

  it("shows edit input when row is in save mode", () => {
    render(
      <TodoListItem
        {...baseProps}
        activeEditId="1"
        editTitle="Updated title"
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Edit task title" }),
    ).toHaveValue("Updated title");
    expect(
      screen.getByRole("button", { name: "Save task" }),
    ).toBeInTheDocument();
  });

  it("calls onDelete and onEditSave from action buttons", () => {
    render(<TodoListItem {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete task" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit task" }));

    expect(baseProps.onDelete).toHaveBeenCalledWith("1");
    expect(baseProps.onEditSave).toHaveBeenCalledWith("1");
  });

  it("disables complete checkbox for optimistic rows", () => {
    render(
      <TodoListItem
        {...baseProps}
        todo={{ id: "optimistic-1", title: "Draft", completed: false }}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("shows spinner instead of checkbox while complete is pending", () => {
    render(<TodoListItem {...baseProps} pendingCompleteId="1" />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
