export default function truncateString(value?: string, maxLength = 20): string {
  if (!value) return '';
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}
