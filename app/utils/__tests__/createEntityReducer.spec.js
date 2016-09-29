import createEntityReducer from '../createEntityReducer';
import joinReducers from '../joinReducers';

const FETCH = {
  BEGIN: 'FETCH_BEGIN',
  SUCCESS: 'FETCH_SUCCESS',
  FAILURE: 'FETCH_FAILURE'
};

const reducer = createEntityReducer({
  key: 'events',
  types: {
    fetch: FETCH
  },
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
      type: 'SUCCESS',
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
    const state = reducer(undefined, { type: FETCH.BEGIN });
    expect(state.fetching).toEqual(true);

    const nextState = reducer(state, { type: FETCH.SUCCESS });
    expect(nextState.fetching).toEqual(false);
  });

  it('should run the mutate reducer', () => {
    const customFlag = (state, action) => {
      if (action.type === FETCH.BEGIN) {
        return {
          ...state,
          customFlag: true
        };
      }
      return state;
    };

    const customFlag2 = (state, action) => {
      if (action.type === FETCH.BEGIN) {
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
      types: {
        fetch: FETCH
      },
      mutate: joinReducers(
        customFlag,
        customFlag2
      )
    });

    expect(reducer(undefined, { type: FETCH.BEGIN })).toEqual({
      fetching: true,
      customFlag: false,
      customFlag2: false,
      byId: {},
      items: []
    });
  });
});
