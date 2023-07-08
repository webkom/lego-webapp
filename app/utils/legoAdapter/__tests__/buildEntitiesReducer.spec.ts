import { createEntityAdapter, createReducer } from '@reduxjs/toolkit';
import type { UnknownArticle } from 'app/store/models/Article';
import { EntityType } from 'app/store/models/entities';
import buildEntitiesReducer from 'app/utils/legoAdapter/buildEntitiesReducer';

describe('buildEntitiesReducer', () => {
  const adapter = createEntityAdapter<UnknownArticle>();
  const initialState = adapter.getInitialState();

  const reducer = createReducer(initialState, (builder) => {
    buildEntitiesReducer(builder, adapter, EntityType.Articles);
  });

  it('adds new entities of the specified type', () => {
    expect(
      reducer(initialState, {
        type: 'WHATEVER.FETCH.SUCCESS',
        meta: {},
        payload: {
          entities: {
            [EntityType.Articles]: {
              1: {
                id: 1,
                expected: true,
              },
            },
          },
        },
      })
    ).toEqual({
      ids: [1],
      entities: {
        1: {
          id: 1,
          expected: true,
        },
      },
    });
  });
  it('updates entities of the specified type', () => {
    const state = {
      ...initialState,
      ids: [1],
      entities: {
        1: {
          id: 1,
          property: 'initial',
          otherProperty: 'unchanged',
        } as unknown as UnknownArticle,
      },
    };
    expect(
      reducer(state, {
        type: 'WHATEVER.FETCH.SUCCESS',
        meta: {},
        payload: {
          entities: {
            [EntityType.Articles]: {
              1: {
                id: 1,
                property: 'changed',
              },
            },
          },
        },
      })
    ).toEqual({
      ids: [1],
      entities: {
        1: {
          id: 1,
          property: 'changed',
          otherProperty: 'unchanged',
        },
      },
    });
  });
  it('ignores entities of other types', () => {
    expect(
      reducer(initialState, {
        type: 'WHATEVER.FETCH.SUCCESS',
        payload: {
          entities: {
            [EntityType.Announcements]: {
              id: 1,
              expected: false,
            },
          },
        },
      })
    ).toEqual(initialState);
  });
});
