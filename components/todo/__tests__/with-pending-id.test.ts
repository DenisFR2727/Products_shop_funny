import { withPendingId } from "../utils/with-pending-id";

describe("withPendingId", () => {
  it("sets pending id before work and clears it after success", async () => {
    const setPending = jest.fn();
    const work = jest.fn().mockResolvedValue(undefined);

    await withPendingId("todo-1", setPending, work);

    expect(setPending).toHaveBeenNthCalledWith(1, "todo-1");
    expect(work).toHaveBeenCalledTimes(1);
    expect(setPending).toHaveBeenLastCalledWith(expect.any(Function));

    const clearPending = setPending.mock.calls[1][0] as (
      prev: string | null,
    ) => string | null;
    expect(clearPending("todo-1")).toBeNull();
  });

  it("clears pending id even when work throws", async () => {
    const setPending = jest.fn();
    const work = jest.fn().mockRejectedValue(new Error("fail"));

    await expect(
      withPendingId("todo-2", setPending, work),
    ).rejects.toThrow("fail");

    const clearPending = setPending.mock.calls[1][0] as (
      prev: string | null,
    ) => string | null;
    expect(clearPending("todo-2")).toBeNull();
  });

  it("does not clear pending if another id took over", async () => {
    const setPending = jest.fn();
    const work = jest.fn().mockResolvedValue(undefined);

    await withPendingId("todo-3", setPending, work);

    const clearPending = setPending.mock.calls[1][0] as (
      prev: string | null,
    ) => string | null;
    expect(clearPending("other-id")).toBe("other-id");
  });
});
