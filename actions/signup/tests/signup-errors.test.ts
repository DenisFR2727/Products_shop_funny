import { ApiError } from "@/lib/api/error";

import { mapSignupApiError, SIGNUP_ERRORS } from "../signup-errors";

describe("signup-errors", () => {
  describe("mapSignupApiError", () => {
    it("maps ApiError 409 to email-taken message", () => {
      expect(mapSignupApiError(new ApiError(409, "conflict"))).toBe(
        SIGNUP_ERRORS.emailTaken,
      );
    });

    it("maps ApiError 402 to service-unavailable message", () => {
      expect(mapSignupApiError(new ApiError(402, "payment"))).toBe(
        SIGNUP_ERRORS.serviceUnavailable,
      );
    });

    it("maps ApiError 0 to service-unreachable message", () => {
      expect(mapSignupApiError(new ApiError(0, "network"))).toBe(
        SIGNUP_ERRORS.serviceUnreachable,
      );
    });

    it("maps unknown errors to the fallback verify message", () => {
      expect(mapSignupApiError(new Error("boom"))).toBe(
        SIGNUP_ERRORS.emailVerifyFailed,
      );
    });
  });
});
