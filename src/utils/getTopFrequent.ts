export interface GetTopFrequentItem<T> {
  key: string;
  count: number;
  sample: T;
}

export const getTopFrequent = <T>(
  items: T[],
  getKey: (item: T) => string | undefined,
  n = 8
): GetTopFrequentItem<T>[] => {
  const counts = new Map<string, number>();
  const extra = new Map<string, T>();
  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
    if (!extra.has(key)) extra.set(key, item);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count, sample: extra.get(key) as T }));
};
