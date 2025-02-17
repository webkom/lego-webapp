export const isTruthy = <T>(x: T | null | undefined | false | '' | 0): x is T =>
  Boolean(x);

export const isNotNullish = <T>(v: T | null | undefined): v is T =>
  v !== null && v !== undefined;
