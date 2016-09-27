import { combineReducers } from 'redux';
import createEntityReducer from '../createEntityReducer';

const reducer = combineReducers({
  ...createEntityReducer({
    key: 'events',
    types: ['FETCH', 'FETCH_SUCCESS', 'FETCH_FAILURE']
  }),
  smashed: (state = false, action) => {
    if (action.type === 'SMASH') {
      return true;
    }
    return state;
  }
});

describe('createEntityReducer', () => {
  it('should reduce', () => {
    expect(reducer(undefined, { type: 'SMASH' })).toEqual({
      byId: {},
      ids: [],
      fetching: false,
      smashed: true
    });
  });

  it('should pick up entities from actions', () => {
    expect(reducer(undefined, {
      type: 'FETCH_SUCCESS',
      payload: {
        entities: {
          events: {
            1: { name: 'Hello' }
          }
        },
        result: [1]
      }
    })).toEqual({
      byId: {
        1: { name: 'Hello' }
      },
      ids: [1],
      fetching: false,
      smashed: false
    });
  });
});
