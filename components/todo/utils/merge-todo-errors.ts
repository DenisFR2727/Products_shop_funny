/** Merges todo mutation/create error lists; dedupes by message, preserves order. */
export function mergeTodoErrors(
  ...sources: (string[] | null | undefined)[]
): string[] | null {
  const merged: string[] = [];
  const seen = new Set<string>();

  for (const source of sources) {
    if (!source?.length) continue;
    for (const message of source) {
      if (seen.has(message)) continue;
      seen.add(message);
      merged.push(message);
    }
  }

  return merged.length > 0 ? merged : null;
}
