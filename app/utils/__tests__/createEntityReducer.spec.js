import createEntityReducer from '../createEntityReducer';
import joinReducers from '../joinReducers';

const reducer = createEntityReducer({
  key: 'events',
  types: ['FETCH', 'FETCH_SUCCESS', 'FETCH_FAILURE'],
  initialState: {
    smashed: false
  },
  mutate: (state, action) => {
    if (action.type === 'SMASH') {
      return { ...state, smashed: true };
    }
    return state;
  }
});

describe('createEntityReducer', () => {
  it('should reduce', () => {
    expect(reducer(undefined, { type: 'SMASH' })).toEqual({
      byId: {},
      items: [],
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
      items: [1],
      fetching: false,
      smashed: false
    });
  });

  it('should toggle the fetching flag', () => {
    const state = reducer(undefined, { type: 'FETCH' });
    expect(state.fetching).toEqual(true);

    const nextState = reducer(state, { type: 'FETCH_SUCCESS' });
    expect(nextState.fetching).toEqual(false);
  });

  it('should run the mutate reducer', () => {
    const customFlag = (state, action) => {
      if (action.type === 'FETCH') {
        return {
          ...state,
          customFlag: true
        };
      }
      return state;
    };

    const customFlag2 = (state, action) => {
      if (action.type === 'FETCH') {
        return {
          ...state,
          customFlag2: false,
          customFlag: false
        };
      }
      return state;
    };

    const reducer = createEntityReducer({
      key: 'users',
      types: ['FETCH', 'FETCH_SUCCESS', 'FETCH_FAILURE'],
      mutate: joinReducers(
        customFlag,
        customFlag2
      )
    });

    expect(reducer(undefined, { type: 'FETCH' })).toEqual({
      fetching: true,
      customFlag: false,
      customFlag2: false,
      byId: {},
      items: []
    });
  });
});
