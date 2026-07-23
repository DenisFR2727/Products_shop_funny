import {
  mapTodoActionError,
  rejectOptimisticTodoId,
  TODO_ERRORS,
} from "../todo-errors";
import { ApiError } from "@/lib/api/error";

describe("todo-errors", () => {
  describe("rejectOptimisticTodoId", () => {
    it("rejects optimistic ids for update mode", () => {
      expect(rejectOptimisticTodoId("optimistic-1", "update")).toEqual({
        ok: false,
        errors: [...TODO_ERRORS.optimisticUpdate],
      });
    });

    it("rejects optimistic ids for edit mode", () => {
      expect(rejectOptimisticTodoId("optimistic-1", "edit")).toEqual({
        ok: false,
        errors: [...TODO_ERRORS.optimisticEdit],
      });
    });

    it("allows persisted ids", () => {
      expect(rejectOptimisticTodoId("13", "update")).toBeNull();
    });
  });

  describe("mapTodoActionError", () => {
    it("maps ApiError 400 to invalid task data", () => {
      expect(mapTodoActionError(new ApiError(400, "invalid"))).toEqual([
        ...TODO_ERRORS.invalidRequest,
      ]);
    });

    it("maps ApiError 401 to authorization required", () => {
      expect(mapTodoActionError(new ApiError(401, "unauthorized"))).toEqual([
        ...TODO_ERRORS.authRequired,
      ]);
    });

    it("maps ApiError 404 to refresh message", () => {
      expect(mapTodoActionError(new ApiError(404, "missing"))).toEqual([
        ...TODO_ERRORS.notFoundRefresh,
      ]);
    });

    it("maps other errors to server unavailable", () => {
      expect(mapTodoActionError(new Error("network"))).toEqual([
        ...TODO_ERRORS.serverUnavailable,
      ]);
    });
  });
});
