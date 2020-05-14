// @flow

/**
 *
 */
export default function createQueryString(query: {
  [key: string]: ?string | ?number,
}): string {
  const queryString = Object.keys(query)
    .filter((key) => typeof query[key] === 'number' || !!query[key])
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`
    )
    .join('&');

  return queryString ? `?${queryString}` : '';
}
