import getCachedRequest from '../getCachedRequest';
import timekeeper from 'timekeeper';

describe('getCachedRequest', () => {
  let time = Date.now();
  timekeeper.freeze(time);

  it('should return null without endpoint', () => {
    const state = {};
    const endpoint = '';
    expect(getCachedRequest(state, endpoint, 10)).toEqual(null);
  });

  it('should return null without cacheSeconds', () => {
    const state = {};
    const endpoint = '/events/1';
    expect(getCachedRequest(state, endpoint, null)).toEqual(null);
  });

  it('should return null with empty fetchHistory', () => {
    const state = { fetchHistory: {} };
    const endpoint = '/events/1';
    expect(getCachedRequest(state, endpoint, 10)).toEqual(null);
  });

  it('should return action when endpoint exists', () => {
    const action = {
      type: 'Event.FETCH.SUCCESS',
      payload: {}
    };
    const state = {
      fetchHistory: {
        '/events/1': {
          timestamp: Date.now(),
          action
        }
      }
    };
    const endpoint = '/events/1';
    expect(getCachedRequest(state, endpoint, 10)).toEqual(action);
  });

  it('should return null when time has passed', () => {
    const action = {
      type: 'Event.FETCH.SUCCESS',
      payload: {}
    };
    const state = {
      fetchHistory: {
        '/events/1': {
          timestamp: Date.now() - 20 * 1000,
          action
        }
      }
    };
    const endpoint = '/events/1';
    expect(getCachedRequest(state, endpoint, 10)).toEqual(null);
  });
});
