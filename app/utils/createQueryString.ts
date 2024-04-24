import type { ParsedQs } from 'qs';

export default function createQueryString(query: ParsedQs = {}): string {
  const queryString = Object.keys(query)
    .filter((key) => typeof query[key] === 'number' || !!query[key])
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`,
    )
    .join('&');
  return queryString ? `?${queryString}` : '';
}
