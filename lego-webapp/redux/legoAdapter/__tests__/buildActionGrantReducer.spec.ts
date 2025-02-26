import { createReducer } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import buildActionGrantReducer from '~/redux/legoAdapter/buildActionGrantReducer';
import { EntityType } from '~/redux/models/entities';

describe('buildActionGrantReducer', () => {
  const initialState = {
    actionGrant: [],
  };

  const reducer = createReducer(initialState, (builder) => {
    buildActionGrantReducer(builder, EntityType.Articles);
  });

  it('should replace actionGrant if schemaKey of the action matches entity type', () => {
    expect(
      reducer(initialState, {
        type: 'FETCH.SUCCESS',
        payload: {
          actionGrant: ['expected'],
        },
        meta: {
          endpoint: '/endpoint',
          schemaKey: EntityType.Articles,
        },
      }),
    ).toEqual({
      ...initialState,
      actionGrant: ['expected'],
    });
  });
  it('should not change actionGrant if shemaKey does not match', () => {
    expect(
      reducer(initialState, {
        type: 'FETCH.SUCCESS',
        payload: {
          actionGrant: ['expected'],
        },
        meta: {
          endpoint: '/endpoint',
          schemaKey: EntityType.Comments,
        },
      }),
    ).toEqual(initialState);
  });
});
