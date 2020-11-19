import getCachedRequest from '../getCachedRequest';
import timekeeper from 'timekeeper';

describe('getCachedRequest', () => {
  let time = Date.now();
  timekeeper.freeze(time);

  it('should return null without endpoint', () => {
    const state = {};
    const endpoint = '';
    const paginationKey = '';
    const cursor = '';
    expect(
      getCachedRequest(state, endpoint, paginationKey, cursor, 10)
    ).toEqual(null);
  });

  it('should return null without cacheSeconds', () => {
    const state = {};
    const endpoint = '/events/1';
    const paginationKey = '';
    const cursor = '';
    expect(
      getCachedRequest(state, endpoint, paginationKey, cursor, null)
    ).toEqual(null);
  });

  it('should return null with empty fetchHistory', () => {
    const state = { fetchHistory: {} };
    const endpoint = '/events/1';
    const paginationKey = '';
    const cursor = '';
    expect(
      getCachedRequest(state, endpoint, paginationKey, cursor, 10)
    ).toEqual(null);
  });

  it('should return action when endpoint exists', () => {
    const action = {
      type: 'Event.FETCH.SUCCESS',
      payload: {},
    };
    const state = {
      fetchHistory: {
        '/events/1': {
          timestamp: Date.now(),
          action,
        },
      },
    };
    const paginationKey = '';
    const cursor = '';
    const endpoint = '/events/1';
    expect(
      getCachedRequest(state, endpoint, paginationKey, cursor, 10)
    ).toEqual(action);
  });

  it('should return work with paginationKey and cursor', () => {
    const action = {
      type: 'Event.FETCH.SUCCESS',
      payload: {},
    };
    const state = {
      fetchHistory: {
        'paginationKeyAndCursor:/events/1/?foo=2&cursor=base64': {
          timestamp: Date.now(),
          action,
        },
      },
    };
    const endpoint = '/events/1';
    const paginationKey = '/events/1/?foo=2';
    const cursor = 'base64';
    expect(
      getCachedRequest(state, endpoint, paginationKey, cursor, 10)
    ).toEqual(action);
  });

  it('should return work with paginationKey and no cursor', () => {
    const action = {
      type: 'Event.FETCH.SUCCESS',
      payload: {},
    };
    const state = {
      fetchHistory: {
        'paginationKeyAndCursor:/events/1/?foo=2&cursor=': {
          timestamp: Date.now(),
          action,
        },
      },
    };
    const endpoint = '/events/1';
    const paginationKey = '/events/1/?foo=2';
    const cursor = '';
    expect(
      getCachedRequest(state, endpoint, paginationKey, cursor, 10)
    ).toEqual(action);
  });

  it('should return null when time has passed', () => {
    const action = {
      type: 'Event.FETCH.SUCCESS',
      payload: {},
    };
    const state = {
      fetchHistory: {
        '/events/1': {
          timestamp: Date.now() - 20 * 1000,
          action,
        },
      },
    };
    const endpoint = '/events/1';
    const paginationKey = '';
    const cursor = '';
    expect(
      getCachedRequest(state, endpoint, paginationKey, cursor, 10)
    ).toEqual(null);
  });
});
