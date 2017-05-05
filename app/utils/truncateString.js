// @flow

export default function truncateString(
  value: string,
  maxLength: number = 20
): string {
  if (!value) return '';
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}
