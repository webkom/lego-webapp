import 'isomorphic-fetch';
import sinon from 'sinon';
import { fetchJSON, createQueryString } from '../http';

describe('http/fetchJSON', () => {
  beforeEach(() => {
    sinon.stub(global, 'fetch');
  });

  afterEach(() => {
    global.fetch.restore();
  });

  describe('successful response', () => {
    beforeEach(() => {
      const res = new Response('{"hello":"world"}', {
        status: 200,
        headers: {
          'Content-type': 'application/json'
        }
      });

      global.fetch.returns(Promise.resolve(res));
    });

    it('should format the response correctly', () =>
      fetchJSON('https://abakus.no')
        .then(({ json }) => {
          expect(json).toEqual({ hello: 'world' });
        })
    );
  });

  describe('response with error', () => {
    beforeEach(() => {
      const res = new Response('{}', {
        status: 401,
        statusText: 'Unauthorized',
        headers: {
          'Content-type': 'application/json'
        }
      });

      global.fetch.returns(Promise.resolve(res));
    });

    it('should catch errors', () =>
      fetchJSON('https://abakus.no')
        .then(() => {}, (error) => {
          expect(error.response.statusText).toEqual('Unauthorized');
        })
    );
  });
});

describe('http/createQueryString', () => {
  it('should work for strings and numbers', () => {
    const qs = createQueryString({ year: 2016, name: 'webkom', foo: 0 });
    expect(qs).toEqual('?year=2016&name=webkom&foo=0');
  });

  it('should remove keys for empty values', () => {
    const qs = createQueryString({ year: '', name: '', bar: null });
    expect(qs).toEqual('');
  });
});
