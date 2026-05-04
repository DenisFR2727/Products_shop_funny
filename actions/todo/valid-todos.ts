export type TodoCreateValidation =
  | { ok: false; errors: string[] }
  | { ok: true; title: string; userId: string };

export function validateTodoCreate(
  rawTitle: unknown,
  userId: string | undefined,
): TodoCreateValidation {
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  const errors: string[] = [];

  if (!title) {
    errors.push("Title is required");
  }

  if (!userId) {
    errors.push("Потрібна авторизація");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (!userId) {
    return { ok: false, errors: ["Потрібна авторизація"] };
  }

  return { ok: true, title, userId };
}
