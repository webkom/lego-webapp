import fetchHistory from "../fetchHistory";
import timekeeper from "timekeeper";
import { compose } from "redux";
describe('fetchHistory', () => {
  let time = Date.now();
  timekeeper.freeze(time);
  beforeEach(() => {
    global.__CLIENT__ = false;
  });
  afterEach(() => {
    global.__CLIENT__ = true;
  });
  it('should have correct initialState', () => {
    const prevState = {};
    expect(fetchHistory(prevState, {})).toEqual({});
  });
  it('should not throw when success equals false', () => {
    const prevState = {};
    const action = {
      meta: {
        success: false
      }
    };
    expect(fetchHistory(prevState, action)).toEqual({});
  });
  it('should not throw when success equals false with type', () => {
    const prevState = {};
    const action = {
      type: 'Event.SUCCESS',
      meta: {
        success: false
      }
    };
    expect(fetchHistory(prevState, action)).toEqual({});
  });
  it('should not throw when success equals EVENT.SUCCESS with type', () => {
    const prevState = {};
    const action = {
      type: 'Event.BEGIN',
      meta: {
        success: 'EVENT.SUCCESS'
      }
    };
    expect(fetchHistory(prevState, action)).toEqual({});
  });
  it('should set Date.now() on the server', () => {
    const prevState = {};
    const action = {
      type: 'Event.SUCCESS',
      payload: {},
      meta: {
        endpoint: 'events/1/',
        success: 'Event.SUCCESS'
      }
    };
    expect(fetchHistory(prevState, action)).toEqual({
      'events/1/': {
        timestamp: Date.now(),
        action: { ...action,
          cached: true
        },
        cacheCounter: 0
      }
    });
  });
  it('should not cache on the frontend', () => {
    global.__CLIENT__ = true;
    const prevState = {
      'company/': {
        timestamp: new Date(1504090888011),
        action: {}
      }
    };
    const action = {
      type: 'Event.SUCCESS',
      payload: {},
      meta: {
        endpoint: 'events/1/',
        success: 'Event.SUCCESS'
      }
    };
    expect(fetchHistory(prevState, action)).toEqual(prevState);
  });
  it('should only use cache 3 times, and should bump counter', () => {
    global.__CLIENT__ = true;
    const prevState = {
      endpoint: {
        timestamp: new Date(1504090888011),
        cached: true,
        cacheCounter: 0,
        action: {}
      }
    };
    const action = {
      type: 'Event.SUCCESS',
      payload: {},
      meta: {
        endpoint: 'endpoint',
        success: 'Event.SUCCESS'
      }
    };
    expect(fetchHistory(prevState, action)).toEqual({
      endpoint: {
        timestamp: new Date(1504090888011),
        cached: true,
        cacheCounter: 1,
        action: {}
      }
    });
  });
  it('should only use cache 3 times, and should evict value when used more than that', () => {
    global.__CLIENT__ = true;
    const prevState = {
      endpoint: {
        timestamp: new Date(1504090888011),
        cached: true,
        cacheCounter: 0,
        action: {}
      }
    };
    const action = {
      type: 'Event.SUCCESS',
      payload: {},
      meta: {
        endpoint: 'endpoint',
        success: 'Event.SUCCESS'
      }
    };
    expect(compose(state => fetchHistory(state, action), state => fetchHistory(state, action), state => fetchHistory(state, action))(prevState)).toEqual({});
  });
  it('should work with paginationKey', () => {
    const prevState = {
      'company/': {
        timestamp: new Date(1504090888011),
        action: {}
      }
    };
    const action = {
      type: 'Event.SUCCESS',
      payload: {},
      meta: {
        paginationKey: '/api/bar/2/?foo=bar',
        cursor: 'base64',
        endpoint: 'events/1/',
        success: 'Event.SUCCESS'
      }
    };
    expect(fetchHistory(prevState, action)).toEqual({ ...prevState,
      'paginationKeyAndCursor:/api/bar/2/?foo=bar&cursor=base64': {
        timestamp: Date.now(),
        action: { ...action,
          cached: true
        },
        cacheCounter: 0
      }
    });
  });
  it('should append new history entry', () => {
    const prevState = {
      'company/': {
        timestamp: new Date(1504090888011),
        action: {}
      }
    };
    const action = {
      type: 'Event.SUCCESS',
      payload: {},
      meta: {
        endpoint: 'events/1/',
        success: 'Event.SUCCESS'
      }
    };
    expect(fetchHistory(prevState, action)).toEqual({ ...prevState,
      'events/1/': {
        timestamp: Date.now(),
        action: { ...action,
          cached: true
        },
        cacheCounter: 0
      }
    });
  });
});