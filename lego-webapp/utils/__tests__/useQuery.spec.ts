import { describe, it, expect } from 'vitest';
import { parseQueryString, stringifyQuery } from '~/utils/useQuery';

describe('parseQueryString', () => {
  it('should parse string value', () => {
    const initialValues = {
      foo: 'bar',
    };
    const queryString = '?foo=baz';
    const query = parseQueryString(queryString, initialValues);
    expect(query.foo).toBe('baz');
  });
  it('should use default value for missing key', () => {
    const initialValues = {
      foo: 'bar',
    };
    const queryString = '';
    const query = parseQueryString(queryString, initialValues);
    expect(query.foo).toBe('bar');
  });

  it('should parse array values', () => {
    const initialValues = {
      foo: ['fizz'],
    };
    const queryString = '?foo=bar&foo=baz';
    const query = parseQueryString(queryString, initialValues);
    expect(query.foo).toEqual(['bar', 'baz']);
  });

  it('should parse object values', () => {
    const initialValues = {
      foo: {
        fizz: 'buzz',
        razz: 'dazz',
      },
    };
    const queryString = '?foo[fizz]=bizz&foo[razz]=bazz';
    const query = parseQueryString(queryString, initialValues);
    expect(query.foo).toEqual({
      fizz: 'bizz',
      razz: 'bazz',
    });
  });
});

describe('stringifyQuery', () => {
  it('should stringify query object', () => {
    const initialValues = {
      foo: 'bar',
      obj: {
        fizz: 'buzz',
      },
      arr: ['fizz', 'buzz'],
    };

    const query = {
      foo: 'baz',
      obj: {
        fizz: 'bizz',
      },
      arr: ['fizz', 'bizz'],
    };

    const queryString = stringifyQuery(query, initialValues);
    expect(queryString).toBe('?foo=baz&obj[fizz]=bizz&arr=fizz&arr=bizz');
  });

  it('should remove default values', () => {
    const initialValues = {
      foo: 'bar',
      obj: {
        fizz: 'buzz',
      },
      arr: ['fizz', 'buzz'],
    };

    const query = {
      foo: 'bar',
      obj: {
        fizz: 'buzz',
      },
      arr: ['fizz', 'buzz'],
    };

    const queryString = stringifyQuery(query, initialValues);
    expect(queryString).toBe('');
  });
});
