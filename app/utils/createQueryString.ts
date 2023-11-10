/**
 *
 */
export default function createQueryString(
  query: Record<string, string | number | boolean | undefined | null>,
): string {
  const queryString = Object.keys(query)
    .filter((key) => typeof query[key] === 'number' || !!query[key])
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`,
    )
    .join('&');
  return queryString ? `?${queryString}` : '';
}
