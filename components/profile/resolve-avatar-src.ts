/**
 * Normalizes user avatar for UI: http(s), site-relative paths, or data:image previews.
 * Rejects invalid API values (numbers coerced to "1", "undefined", etc.).
 */
export function normalizeAvatarSrc(src: unknown): string | null {
  if (src == null) return null;
  if (typeof src === "number") return null;
  if (typeof src !== "string") return null;
  const trimmed = src.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
  if (trimmed.startsWith("data:image/")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") return trimmed;
  } catch {
    return null;
  }
  return null;
}

/** True when src should use native <img> (data URL), not next/image. */
export function isDataImageAvatarSrc(src: string): boolean {
  return src.startsWith("data:image/");
}
