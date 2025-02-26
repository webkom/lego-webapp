import { describe, it, expect } from 'vitest';
import createQueryString from '../createQueryString';

describe('createQueryString', () => {
  it('should work for strings and numbers', () => {
    const qs = createQueryString({
      year: 2016,
      name: 'webkom',
      foo: 0,
    });
    expect(qs).toBe('?year=2016&name=webkom&foo=0');
  });
  it('should remove keys for empty values', () => {
    const qs = createQueryString({
      year: '',
      name: '',
      bar: null,
    });
    expect(qs).toBe('');
  });
});
