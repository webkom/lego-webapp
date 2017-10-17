import fetchHistory from '../fetchHistory';
import timekeeper from 'timekeeper';

describe('fetchHistory', () => {
  let time = Date.now();
  timekeeper.freeze(time);
  it('should have correct initialState', () => {
    const prevState = {};
    expect(fetchHistory(prevState, {})).toEqual({});
  });

  it('should not crash when success equals false', () => {
    const prevState = {};
    const action = { meta: { success: false } };
    expect(fetchHistory(prevState, action)).toEqual({});
  });

  it('should not crash when success equals false with type', () => {
    const prevState = {};
    const action = { type: 'Event.SUCCESS', meta: { success: false } };
    expect(fetchHistory(prevState, action)).toEqual({});
  });

  it('should not crash when success equals false with type', () => {
    const prevState = {};
    const action = { type: 'Event.BEGIN', meta: { success: 'EVENT.SUCCESS' } };
    expect(fetchHistory(prevState, action)).toEqual({});
  });

  it('should set Date.now()', () => {
    const prevState = {};
    const action = {
      type: 'Event.SUCCESS',
      payload: {},
      meta: { endpoint: 'events/1/', success: 'Event.SUCCESS' }
    };
    expect(fetchHistory(prevState, action)).toEqual({
      'events/1/': {
        timestamp: Date.now(),
        action
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
      meta: { endpoint: 'events/1/', success: 'Event.SUCCESS' }
    };
    expect(fetchHistory(prevState, action)).toEqual({
      ...prevState,
      'events/1/': {
        timestamp: Date.now(),
        action
      }
    });
  });
});
