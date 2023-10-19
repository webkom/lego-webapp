import 'isomorphic-fetch';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import fetchJSON from '../fetchJSON';

describe('fetchJSON', () => {
  describe('successful response', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockImplementation(() => {
        const res = new Response('{"hello":"world"}', {
          status: 200,
          headers: {
            'Content-type': 'application/json',
          },
        });
        return Promise.resolve(res);
      });
    });
    it('should format the response correctly', () =>
      fetchJSON('https://abakus.no').then((response) => {
        expect(response.jsonData).toEqual({
          hello: 'world',
        });
      }));
  });
  describe('response with error', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockImplementation(() => {
        const response = new Response('{}', {
          status: 401,
          statusText: 'Unauthorized',
          headers: {
            'Content-type': 'application/json',
          },
        });
        return Promise.resolve(response);
      });
    });
    it('should catch errors', () =>
      fetchJSON('https://abakus.no').then(
        () => {},
        (error) => {
          expect(error.response.statusText).toBe('Unauthorized');
        }
      ));
  });
});
