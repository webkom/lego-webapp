import { describe, expect, it } from 'vitest';
import { parseLendableObjectId } from './deleteUtils';

describe('parseLendableObjectId', () => {
  it('parses numeric ids from route params', () => {
    expect(parseLendableObjectId('42')).toBe(42);
  });

  it('returns null for missing id', () => {
    expect(parseLendableObjectId(undefined)).toBeNull();
  });

  it('returns null for non-integer id values', () => {
    expect(parseLendableObjectId('abc')).toBeNull();
    expect(parseLendableObjectId('1.5')).toBeNull();
  });
});
