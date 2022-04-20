export function fromTitleEntries<T>(
	entries: Array<{ title: string; value: T } | undefined>
): Record<string, T> {
	return Object.fromEntries(
		entries
			.filter((entry) => entry !== undefined)
			.map((entry) => [entry!.title, entry!.value])
	);
}
