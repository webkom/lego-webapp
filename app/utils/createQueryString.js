// @flow

/**
 *
 */
export default function createQueryString(query: {
  [id: string]: string
}): string {
  const queryString = Object.keys(query)
    .filter(key => typeof query[key] === 'number' || !!query[key])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');

  return queryString ? `?${queryString}` : '';
}
