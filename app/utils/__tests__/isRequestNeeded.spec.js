import isRequestNeeded from '../isRequestNeeded';
import timekeeper from 'timekeeper';

describe('isRequestNeeded', () => {
  let time = Date.now();
  timekeeper.freeze(time);

  it('should return true without endpoint', () => {
    const state = {};
    const endpoint = '';
    expect(isRequestNeeded(state, endpoint, 10)).toEqual(true);
  });

  it('should return true without cacheSeconds', () => {
    const state = {};
    const endpoint = '/events/1';
    expect(isRequestNeeded(state, endpoint, null)).toEqual(true);
  });

  it('should return true with empty fetchHistory', () => {
    const state = { fetchHistory: {} };
    const endpoint = '/events/1';
    expect(isRequestNeeded(state, endpoint, 10)).toEqual(true);
  });

  it('should return false when endpoint exists', () => {
    const state = { fetchHistory: { '/events/1': Date.now() } };
    const endpoint = '/events/1';
    expect(isRequestNeeded(state, endpoint, 10)).toEqual(false);
  });

  it('should return true when time has passed', () => {
    const state = { fetchHistory: { '/events/1': Date.now() - 20 * 1000 } };
    const endpoint = '/events/1';
    expect(isRequestNeeded(state, endpoint, 10)).toEqual(true);
  });
});
