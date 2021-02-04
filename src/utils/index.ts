type List<T> = ArrayLike<T>;

export function compact<T>(
  array: List<T | null | undefined | false | "" | 0> | null | undefined
): T[] {
  const length = array == null ? 0 : array.length,
    result = [];
  let index = -1,
    resIndex = 0;

  if (!array) return [];

  while (++index < length) {
    const value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}
