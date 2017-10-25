import createEntityReducer, {
  fetching,
  entities
} from '../createEntityReducer';
import joinReducers from '../joinReducers';
import { eventSchema } from 'app/reducers';
import { normalize } from 'normalizr';

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
      actionGrant: [],
      byId: {},
      items: [],
      fetching: false,
      smashed: true,
      hasMore: false,
      pagination: {}
    });
  });

  it('should pick up entities from actions', () => {
    expect(
      reducer(undefined, {
        type: FETCH.SUCCESS,
        payload: {
          actionGrant: ['list'],
          entities: {
            events: {
              0: { name: 'Hello' },
              1: { name: 'Hello' }
            }
          },
          result: [0, 1]
        }
      })
    ).toEqual({
      actionGrant: ['list'],
      byId: {
        0: { name: 'Hello' },
        1: { name: 'Hello' }
      },
      items: [0, 1],
      fetching: false,
      hasMore: false,
      smashed: false,
      pagination: {}
    });
  });

  it('should handle items as strings gracefully', () => {
    expect(
      reducer(undefined, {
        type: FETCH.SUCCESS,
        payload: {
          actionGrant: ['list'],
          entities: {
            events: {
              1: { name: '1' },
              warlo: { name: 'warlo' }
            }
          },
          result: [1, 'warlo']
        }
      })
    ).toEqual({
      actionGrant: ['list'],
      byId: {
        1: { name: '1' },
        warlo: { name: 'warlo' }
      },
      items: [1, 'warlo'],
      fetching: false,
      hasMore: false,
      smashed: false,
      pagination: {}
    });
  });

  it('should handle non-numeric ids that starts with a digit', () => {
    expect(
      reducer(undefined, {
        type: FETCH.SUCCESS,
        payload: {
          actionGrant: ['list'],
          entities: {
            events: {
              '1-per': { name: 'per' },
              '1-warlo': { name: 'warlo' }
            }
          },
          result: ['1-per', '1-warlo']
        }
      })
    ).toEqual({
      actionGrant: ['list'],
      byId: {
        '1-per': { name: 'per' },
        '1-warlo': { name: 'warlo' }
      },
      items: ['1-per', '1-warlo'],
      fetching: false,
      hasMore: false,
      smashed: false,
      pagination: {}
    });
  });

  it('should reduce actionGrant when result is empty', () => {
    expect(
      reducer(undefined, {
        type: FETCH.SUCCESS,
        payload: {
          actionGrant: ['list', 'create'],
          entities: {},
          result: []
        }
      })
    ).toEqual({
      actionGrant: ['list', 'create'],
      byId: {},
      items: [],
      fetching: false,
      smashed: false,
      hasMore: false,
      pagination: {}
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
      mutate: joinReducers(customFlag, customFlag2)
    });

    expect(reducer(undefined, { type: FETCH.BEGIN })).toEqual({
      fetching: true,
      customFlag: false,
      customFlag2: false,
      actionGrant: [],
      byId: {},
      items: [],
      hasMore: false,
      pagination: {}
    });
  });
});

describe('fetching()', () => {
  it('should toggle fetching flags', () => {
    const state = {};
    const reducer = fetching(FETCH);
    expect(reducer(state, { type: FETCH.BEGIN })).toEqual({
      fetching: true
    });

    expect(reducer(state, { type: FETCH.SUCCESS })).toEqual({
      fetching: false
    });

    expect(reducer(state, { type: FETCH.FAILURE })).toEqual({
      fetching: false
    });
  });
});

describe('entities()', () => {
  it('store entities', () => {
    const state = {
      actionGrant: [],
      byId: {},
      items: []
    };

    const reducer = entities('users');

    const user = {
      id: 1,
      name: 'Hanse'
    };

    const action = {
      type: 'ADD_USER',
      payload: {
        entities: {
          users: {
            1: user
          }
        },
        result: 1
      }
    };

    expect(reducer(state, action)).toEqual({
      actionGrant: [],
      byId: {
        1: user
      },
      items: [1]
    });
  });

  it('should merge carefully', () => {
    const reducer = entities('events');
    const events = [
      {
        id: 1,
        title: 'First Event',
        comments: [
          {
            id: 2,
            author: 'Orhan'
          }
        ]
      },
      {
        id: 2,
        title: 'Second Event',
        comments: []
      }
    ];

    const actions = [
      {
        type: 'FETCH_ALL',
        payload: normalize(events, [eventSchema])
      },
      {
        type: 'FETCH_SINGLE',
        payload: normalize(
          {
            ...events[0],
            title: 'First Event Updated',
            extra: 'Foo'
          },
          eventSchema
        )
      },
      {
        type: 'FETCH_ALL',
        payload: normalize(
          events.map(event => ({
            ...event,
            comments: []
          })),
          [eventSchema]
        )
      },
      {
        type: 'ADD_COMMENT',
        payload: {}
      }
    ];

    expect(actions.reduce(reducer, undefined)).toEqual({
      actionGrant: [],
      byId: {
        1: {
          id: 1,
          title: 'First Event',
          comments: [],
          extra: 'Foo'
        },
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        }
      },
      items: [1, 2],
      pagination: {}
    });
  });
});
