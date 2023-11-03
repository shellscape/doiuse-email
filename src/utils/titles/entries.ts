export function fromTitleEntries<T>(
  entries: Array<{ title: string; value: T } | undefined>
): Record<string, T> {
  return Object.fromEntries(
    entries.filter((entry) => entry !== void 0).map((entry) => [entry!.title, entry!.value])
  );
}
