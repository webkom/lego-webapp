import { createReducer } from '@reduxjs/toolkit';
import { EntityType } from 'app/store/models/entities';
import buildActionGrantReducer from 'app/utils/legoAdapter/bulidActionGrantReducer';

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
          schemaKey: EntityType.Articles,
        },
      })
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
          schemaKey: EntityType.Comments,
        },
      })
    ).toEqual(initialState);
  });
});
