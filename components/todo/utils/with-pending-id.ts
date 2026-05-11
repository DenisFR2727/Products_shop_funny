import type { Dispatch, SetStateAction } from "react";

/** Sets pending to `id`, runs `work`, then clears pending only if it still matches `id`. */
export async function withPendingId(
  id: string,
  setPending: Dispatch<SetStateAction<string | null>>,
  work: () => Promise<void>,
): Promise<void> {
  setPending(id);
  try {
    await work();
  } finally {
    setPending((prev) => (prev === id ? null : prev));
  }
}
