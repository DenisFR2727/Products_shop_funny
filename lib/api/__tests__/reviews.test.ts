import postReviews, { getReviews } from "../reviews";
import { apiRequest } from "../api-request";
import { ReviewItem } from "@/components/reviews/types";

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("../api-request");

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

// ── Fixtures ───────────────────────────────────────────────────────────────

const REVIEW_FIXTURE: ReviewItem = {
  id: "1",
  nameUser: "Alice",
  text: "Fantastic product!",
  date: "2026-01-01T00:00:00.000Z",
};

const REVIEWS_LIST: ReviewItem[] = [
  REVIEW_FIXTURE,
  { id: "2", nameUser: "Bob", text: "Pretty good.", date: "2026-02-01T00:00:00.000Z" },
];

const EXPECTED_URL = "https://692dacb6e5f67cd80a4c7d05.mockapi.io/reviews";

// ── Tests ──────────────────────────────────────────────────────────────────

describe("lib/api/reviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── postReviews ───────────────────────────────────────────────────────────

  describe("postReviews", () => {
    it("calls apiRequest with the correct URL", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEW_FIXTURE);

      await postReviews({ nameUser: "Alice", text: "Fantastic product!", date: "2026-01-01T00:00:00.000Z" });

      expect(mockedApiRequest).toHaveBeenCalledWith(
        EXPECTED_URL,
        "Failed post reviews",
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("calls apiRequest with method POST", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEW_FIXTURE);

      await postReviews({ nameUser: "Alice", text: "Fantastic product!", date: "2026-01-01T00:00:00.000Z" });

      const [, , init] = mockedApiRequest.mock.calls[0];
      expect((init as RequestInit).method).toBe("POST");
    });

    it("serialises the payload as JSON in the request body", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEW_FIXTURE);

      const data = { nameUser: "Alice", text: "Fantastic product!", date: "2026-01-01T00:00:00.000Z" };
      await postReviews(data);

      const [, , init] = mockedApiRequest.mock.calls[0];
      expect((init as RequestInit).body).toBe(JSON.stringify(data));
    });

    it("sets Content-Type header to application/json", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEW_FIXTURE);

      await postReviews({ nameUser: "Alice", text: "Fantastic product!", date: "2026-01-01T00:00:00.000Z" });

      const [, , init] = mockedApiRequest.mock.calls[0];
      expect((init as RequestInit & { headers: Record<string, string> }).headers["Content-Type"]).toBe("application/json");
    });

    it("uses cache: no-store", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEW_FIXTURE);

      await postReviews({ nameUser: "Alice", text: "Fantastic product!", date: "2026-01-01T00:00:00.000Z" });

      const [, , init] = mockedApiRequest.mock.calls[0];
      expect((init as RequestInit).cache).toBe("no-store");
    });

    it("returns the created ReviewItem from apiRequest", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEW_FIXTURE);

      const result = await postReviews({
        nameUser: "Alice",
        text: "Fantastic product!",
        date: "2026-01-01T00:00:00.000Z",
      });

      expect(result).toEqual(REVIEW_FIXTURE);
    });

    it("propagates an error thrown by apiRequest", async () => {
      mockedApiRequest.mockRejectedValueOnce(new Error("Network error"));

      await expect(
        postReviews({ nameUser: "Alice", text: "Fantastic product!", date: "2026-01-01T00:00:00.000Z" }),
      ).rejects.toThrow("Network error");
    });
  });

  // ── getReviews ────────────────────────────────────────────────────────────

  describe("getReviews", () => {
    it("calls apiRequest with the correct URL", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEWS_LIST);

      await getReviews();

      expect(mockedApiRequest).toHaveBeenCalledWith(
        EXPECTED_URL,
        "Failed get reviews",
        expect.objectContaining({ cache: "no-store" }),
      );
    });

    it("uses cache: no-store", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEWS_LIST);

      await getReviews();

      const [, , init] = mockedApiRequest.mock.calls[0];
      expect((init as RequestInit).cache).toBe("no-store");
    });

    it("returns an array of ReviewItems", async () => {
      mockedApiRequest.mockResolvedValueOnce(REVIEWS_LIST);

      const result = await getReviews();

      expect(result).toEqual(REVIEWS_LIST);
      expect(result).toHaveLength(2);
    });

    it("returns an empty array when the API returns no reviews", async () => {
      mockedApiRequest.mockResolvedValueOnce([]);

      const result = await getReviews();

      expect(result).toEqual([]);
    });

    it("propagates an error thrown by apiRequest", async () => {
      mockedApiRequest.mockRejectedValueOnce(new Error("Server down"));

      await expect(getReviews()).rejects.toThrow("Server down");
    });
  });
});
