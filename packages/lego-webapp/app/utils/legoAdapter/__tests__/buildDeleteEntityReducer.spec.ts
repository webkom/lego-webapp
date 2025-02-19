import { createEntityAdapter, createReducer } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import { generateStatuses } from 'app/actions/ActionTypes';
import buildDeleteEntityReducer from 'app/utils/legoAdapter/buildDeleteEntityReducer';

type Entity = {
  id: number;
};

describe('addFetchingReducer', () => {
  const DELETE = generateStatuses('DELETE');
  const UNRELATED = generateStatuses('UNRELATED');

  const baseAction = {
    meta: {
      endpoint: '/something',
      schemaKey: 'something',
      id: 1,
    },
  };

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

  it('should delete on delete success', () => {
    const deleteBegan = reducer(initialState, {
      ...baseAction,
      type: DELETE.BEGIN,
    });
    const actuallyDeleted = reducer(deleteBegan, {
      ...baseAction,
      type: DELETE.SUCCESS,
    });
    expect(actuallyDeleted).toEqual({
      ...initialState,
      ids: [2],
      entities: {
        2: initialState.entities[2],
      },
    });
  });

  it('should not delete on delete failure', () => {
    const deleteBegan = reducer(initialState, {
      ...baseAction,
      type: DELETE.BEGIN,
    });
    const deleteFailed = reducer(deleteBegan, {
      ...baseAction,
      type: DELETE.FAILURE,
    });
    expect(deleteFailed).toEqual(initialState);
  });

  it('should ignore unspecified actionTypes', () => {
    expect(
      reducer(initialState, {
        ...baseAction,
        type: UNRELATED.BEGIN,
      }),
    ).toEqual(initialState);
    expect(
      reducer(initialState, {
        ...baseAction,
        type: UNRELATED.FAILURE,
      }),
    ).toEqual(initialState);
    expect(
      reducer(initialState, {
        ...baseAction,
        type: UNRELATED.SUCCESS,
      }),
    ).toEqual(initialState);
  });
});
