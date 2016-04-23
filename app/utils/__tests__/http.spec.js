import 'isomorphic-fetch';
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

    it('should format the response correctly', (done) => {
      fetchJSON('https://abakus.no')
        .catch(done)
        .then(({ json }) => {
          expect(json).to.eql({ hello: 'world' });
          done();
        });
    });
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

    it('should catch errors', (done) => {
      fetchJSON('https://abakus.no')
        .then(() => {}, (error) => {
          expect(error.response.statusText).to.eql('Unauthorized');
          done();
        }).catch(done);
    });
  });
});

describe('http/createQueryString', () => {
  it('should work for strings and numbers', () => {
    const qs = createQueryString({ year: 2016, name: 'webkom', foo: 0 });
    expect(qs).to.equal('?year=2016&name=webkom&foo=0');
  });

  it('should remove keys for empty values', () => {
    const qs = createQueryString({ year: '', name: '', bar: null });
    expect(qs).to.equal('');
  });
});
