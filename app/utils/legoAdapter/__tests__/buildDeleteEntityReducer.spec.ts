import { createEntityAdapter, createReducer } from '@reduxjs/toolkit';
import { generateStatuses } from 'app/actions/ActionTypes';
import buildDeleteEntityReducer from 'app/utils/legoAdapter/buildDeleteEntityReducer';

type Entity = {
  id: number;
};

describe('addFetchingReducer', () => {
  const DELETE = generateStatuses('DELETE');
  const UNRELATED = generateStatuses('UNRELATED');

  const adapter = createEntityAdapter<Entity>();

  const reducer = createReducer(adapter.getInitialState(), (builder) => {
    buildDeleteEntityReducer(builder, [DELETE]);
  });

  const initialState = {
    ...adapter.getInitialState(),
    ids: [1, 2],
    entities: {
      1: {
        id: 1,
      },
      2: {
        id: 2,
      },
    },
  };

  it('should optimistically soft delete', () => {
    expect(
      reducer(initialState, { type: DELETE.BEGIN, meta: { id: 1 } })
    ).toEqual({
      ...initialState,
      ids: [2],
    });
  });
  it('should reverse optimistic delete on failure', () => {
    const optimisticallyDeleted = reducer(initialState, {
      type: DELETE.BEGIN,
      meta: { id: 1 },
    });
    const restoredState = reducer(optimisticallyDeleted, {
      type: DELETE.FAILURE,
      meta: { id: 1 },
    });
    // the order of ids may change, hence the awkward assertions
    expect(restoredState.entities).toEqual(initialState.entities);
    expect(new Set(restoredState.ids)).toEqual(new Set(initialState.ids));
  });

  it('should actually delete on delete success', () => {
    const optimisticallyDeleted = reducer(initialState, {
      type: DELETE.BEGIN,
      meta: { id: 1 },
    });
    const actuallyDeleted = reducer(optimisticallyDeleted, {
      type: DELETE.SUCCESS,
      meta: { id: 1 },
    });
    expect(actuallyDeleted).toEqual({
      ...initialState,
      ids: [2],
      entities: {
        2: initialState.entities[2],
      },
    });
  });

  it('should ignore unspecified actionTypes', () => {
    expect(
      reducer(initialState, { type: UNRELATED.BEGIN, meta: { id: 1 } })
    ).toEqual(initialState);
    expect(
      reducer(initialState, { type: UNRELATED.FAILURE, meta: { id: 1 } })
    ).toEqual(initialState);
    expect(
      reducer(initialState, { type: UNRELATED.SUCCESS, meta: { id: 1 } })
    ).toEqual(initialState);
  });
});
