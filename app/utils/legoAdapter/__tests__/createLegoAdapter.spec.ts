import { createReducer } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import { generateStatuses } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';

describe('createLegoAdapter', () => {
  describe('getInitialState', () => {
    it('should create initial state', () => {
      const adapter = createLegoAdapter(EntityType.Articles);

      expect(adapter.getInitialState()).toEqual({
        actionGrant: [],
        ids: [],
        entities: {},
        fetching: false,
      });
    });
  });

  describe('buildReducers', () => {
    describe('extra reducers cases/matchers/default case', () => {
      const FETCH = generateStatuses('FETCH');

      it('should reduce cases specified in buildReducers', () => {
        const adapter = createLegoAdapter(EntityType.Articles);
        const initialState = adapter.getInitialState();
        const reducer = createReducer(
          initialState,
          adapter.buildReducers({
            fetchActions: [FETCH],
            extraCases: (addCase) => {
              addCase('testAction', (state) => {
                state.actionGrant = ['expected'];
              });
            },
          })
        );

        expect(reducer(initialState, { type: 'testAction' })).toEqual({
          ...initialState,
          actionGrant: ['expected'],
        });
      });
      it('should reduce matchers specified in buildReducers', () => {
        const adapter = createLegoAdapter(EntityType.Articles);
        const initialState = adapter.getInitialState();
        const reducer = createReducer(
          initialState,
          adapter.buildReducers({
            fetchActions: [FETCH],
            extraMatchers: (addMatcher) => {
              addMatcher(
                ({ type }) => type.includes('test'),
                (state) => {
                  state.actionGrant = ['expected'];
                }
              );
            },
          })
        );

        expect(reducer(initialState, { type: 'testAction' })).toEqual({
          ...initialState,
          actionGrant: ['expected'],
        });
      });
      it('should reduce using the defaultCaseReducer', () => {
        const adapter = createLegoAdapter(EntityType.Articles);

        const initialState = adapter.getInitialState();
        const reducer = createReducer(
          initialState,
          adapter.buildReducers({
            defaultCaseReducer: (state) => {
              state.actionGrant = ['expected'];
            },
          })
        );

        expect(reducer(initialState, { type: 'thisActionIsATest' })).toEqual({
          ...initialState,
          actionGrant: ['expected'],
        });
      });
    });
  });
});
