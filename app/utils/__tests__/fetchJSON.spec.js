import 'isomorphic-fetch';
import sinon from 'sinon';
import fetchJSON from '../fetchJSON';

describe('fetchJSON', () => {
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
        .then((response) => {
          expect(response.jsonData).toEqual({ hello: 'world' });
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
