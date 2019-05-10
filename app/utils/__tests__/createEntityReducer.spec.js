import createEntityReducer, {
  fetching,
  updateEntities,
  deleteEntities
} from '../createEntityReducer';
import joinReducers from '../joinReducers';
import { eventSchema } from 'app/reducers';
import { normalize } from 'normalizr';

const FETCH = {
  BEGIN: 'FETCH.BEGIN',
  SUCCESS: 'FETCH.SUCCESS',
  FAILURE: 'FETCH.FAILURE'
};
const DELETE = {
  BEGIN: 'DELETE.BEGIN',
  SUCCESS: 'DELETE.SUCCESS',
  FAILURE: 'DELETE.FAILURE'
};

const SMASH = 'SMASH';

const reducer = createEntityReducer({
  key: 'events',
  types: {
    fetch: FETCH
  },
  initialState: {
    smashed: false
  },
  mutate: (state, action) => {
    if (action.type === SMASH) {
      return { ...state, smashed: true };
    }
    return state;
  }
});

const FETCH_OTHER = {
  BEGIN: 'FETCH_OTHER.BEGIN',
  SUCCESS: 'FETCH_OTHER.SUCCESS',
  FAILURE: 'FETCH_OTHER.FAILURE'
};

const DELETE_OTHER = {
  BEGIN: 'DELETE_OTHER.BEGIN',
  SUCCESS: 'DELETE_OTHER.SUCCESS',
  FAILURE: 'DELETE_OTHER.FAILURE'
};

const otherReducer = createEntityReducer({
  key: 'events',
  types: {
    fetch: [FETCH, FETCH_OTHER] // fetchTypes as array
  },
  initialState: {
    smashed: false
  },
  mutate: (state, action) => {
    if (action.type === SMASH) {
      return { ...state, smashed: true };
    }
    return state;
  }
});

describe('createEntityReducer', () => {
  it('should reduce', () => {
    expect(reducer(undefined, { type: SMASH })).toEqual({
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
        meta: { schemaKey: 'events' },
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
        },
        meta: { schemaKey: 'events' }
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

  it('should handle fetchTypes as arrays gracefully', () => {
    expect(
      otherReducer(undefined, {
        type: FETCH_OTHER.SUCCESS,
        payload: {
          actionGrant: ['list'],
          entities: {
            events: {
              1: { name: '1' },
              warlo: { name: 'warlo' }
            }
          },
          result: [1, 'warlo']
        },
        meta: { schemaKey: 'events' }
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
        },
        meta: { schemaKey: 'events' }
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
        },
        meta: { schemaKey: 'events' }
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
  it('should handle multiple fetching types', () => {
    const reducer = fetching([FETCH, FETCH_OTHER]);
    expect(reducer({ fetching: false }, { type: FETCH.BEGIN })).toEqual({
      fetching: true
    });

    expect(reducer({ fetching: true }, { type: FETCH_OTHER.SUCCESS })).toEqual({
      fetching: false
    });

    expect(reducer({ fetching: false }, { type: DELETE.SUCCESS })).toEqual({
      fetching: false
    });
  });
});

describe('updateEntities()', () => {
  it('should store entities', () => {
    const state = {
      actionGrant: [],
      byId: {},
      items: []
    };

    const reducer = updateEntities(FETCH, 'users');

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
    const reducer = updateEntities(FETCH, 'events');
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

describe('deleteEntities()', () => {
  it('should delete the given entity', () => {
    const reducer = deleteEntities(DELETE, 'events');

    const state = {
      actionGrant: [],
      byId: {
        1: {
          id: 1,
          title: 'First Event',
          comments: []
        },
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        }
      },
      items: [1, 2],
      pagination: {}
    };

    const action = {
      type: DELETE.SUCCESS,
      meta: { id: 1 }
    };
    expect(reducer(state, action)).toEqual({
      actionGrant: [],
      byId: {
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        }
      },
      items: [2],
      pagination: {}
    });
  });
  it('should handle deleteTypes as array', () => {
    const reducer = deleteEntities([DELETE, DELETE_OTHER], 'events');

    const state = {
      actionGrant: [],
      byId: {
        1: {
          id: 1,
          title: 'First Event',
          comments: []
        },
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        },
        3: {
          id: 3,
          title: 'Third Event',
          comments: []
        }
      },
      items: [1, 2, 3],
      pagination: {}
    };

    const actions = [
      {
        type: DELETE.SUCCESS,
        meta: { id: 1 }
      },
      {
        type: DELETE.SUCCESS,
        meta: { id: 3 }
      }
    ];
    expect(actions.reduce(reducer, state)).toEqual({
      actionGrant: [],
      byId: {
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        }
      },
      items: [2],
      pagination: {}
    });
  });
  it('should handle numbers and strings as keys', () => {
    const reducer = deleteEntities([DELETE, DELETE_OTHER], 'events');

    const state = {
      actionGrant: [],
      byId: {
        1: {
          id: '1',
          title: 'First Event',
          comments: []
        },
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        },
        'string-key': {
          id: 'string-key',
          title: 'Third Event',
          comments: []
        },
        3: {
          id: 3,
          title: 'Third Event',
          comments: []
        },
        4: {
          id: 4,
          title: 'Third Event',
          comments: []
        }
      },
      items: ['1', 2, 3, 4],
      pagination: {}
    };

    const actions = [
      {
        type: DELETE.SUCCESS,
        meta: { id: 1 }
      },
      {
        type: DELETE.SUCCESS,
        meta: { id: 'string-key' }
      },
      {
        type: DELETE.SUCCESS,
        meta: { id: '3' }
      },
      {
        type: DELETE.SUCCESS,
        meta: { id: 4 }
      }
    ];
    expect(actions.reduce(reducer, state)).toEqual({
      actionGrant: [],
      byId: {
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        }
      },
      items: [2],
      pagination: {}
    });
  });
  it('should not delete on error', () => {
    const reducer = deleteEntities(DELETE, 'events');

    const state = {
      actionGrant: [],
      byId: {
        1: {
          id: 1,
          title: 'Second Event',
          comments: []
        },
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        }
      },
      items: [1, 2],
      pagination: {}
    };

    const action = {
      type: DELETE.FAILED,
      meta: { id: 1 }
    };
    expect(reducer(state, action)).toEqual({
      actionGrant: [],
      byId: {
        1: {
          id: 1,
          title: 'Second Event',
          comments: []
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
  it('should only delete on matching type', () => {
    const reducer = deleteEntities(DELETE, 'events');

    const state = {
      actionGrant: [],
      byId: {
        1: {
          id: 1,
          title: 'Second Event',
          comments: []
        },
        2: {
          id: 2,
          title: 'Second Event',
          comments: []
        }
      },
      items: [1, 2],
      pagination: {}
    };

    const action = {
      type: DELETE_OTHER.SUCCESS,
      meta: { id: 1 }
    };
    expect(reducer(state, action)).toEqual({
      actionGrant: [],
      byId: {
        1: {
          id: 1,
          title: 'Second Event',
          comments: []
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
