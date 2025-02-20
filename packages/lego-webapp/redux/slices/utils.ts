export const asArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];
