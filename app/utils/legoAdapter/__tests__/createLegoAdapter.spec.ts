import { createReducer } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import { generateStatuses } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { DetailedArticle } from 'app/store/models/Article';
import type { AsyncApiActionSuccess } from 'app/utils/legoAdapter/asyncApiActions';

const article = {
  id: 42,
  title: 'You will never believe what this reducer reduced!',
  description: 'This is a LEGO+ article, please upgrade your subscription',
} as DetailedArticle;

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

    it('should allow additional initial state to be added', () => {
      const adapter = createLegoAdapter(EntityType.Articles);

      expect(adapter.getInitialState({ smashed: false })).toEqual({
        actionGrant: [],
        ids: [],
        entities: {},
        fetching: false,
        smashed: false,
      });
    });
  });

  describe('buildReducers', () => {
    describe('default reducer functionality', () => {
      const FETCH = generateStatuses('FETCH');
      const actionBase = {
        meta: {
          paginationKey: 'test',
          queryString: '',
          cursor: '',
          errorMessage: 'Henting av artikler feilet',
          enableOptimistic: false,
          endpoint: '/articles/',
          schemaKey: EntityType.Articles,
        },
      };
      const fetchBegin = { ...actionBase, type: FETCH.BEGIN };
      const fetchSuccess: AsyncApiActionSuccess = {
        ...actionBase,
        type: FETCH.SUCCESS,
        payload: {
          actionGrant: ['list', 'create'],
          entities: {
            [EntityType.Articles]: {
              42: article,
            },
          },
          result: [42],
          next: 'url?cursor=c123',
          previous: null,
        },
      };

      const fetchFailure = { ...actionBase, type: FETCH.FAILURE };

      const adapter = createLegoAdapter(EntityType.Articles);
      const initialState = adapter.getInitialState();
      const reducer = createReducer(
        initialState,
        adapter.buildReducers({
          fetchActions: [FETCH],
        })
      );

      it('should set fetching=true on FETCH.BEGIN', () => {
        const newState = reducer(initialState, fetchBegin);
        expect(newState.fetching).toEqual(true);
      });
      it('should set fetching=false on FETCH.SUCCESS', () => {
        const newState = reducer(
          { ...initialState, fetching: true },
          fetchSuccess
        );
        expect(newState.fetching).toBeFalsy();
      });
      it('should set fetching=false on FETCH.FAILURE', () => {
        const newState = reducer(
          { ...initialState, fetching: true },
          fetchFailure
        );
        expect(newState.fetching).toBeFalsy();
      });

      it('should add entities on FETCH.SUCCESS', () => {
        const newState = reducer(initialState, fetchSuccess);
        expect(newState.ids).toEqual([42]);
        expect(newState.entities).toEqual({ 42: article });
      });

      it('should update actionGrant on FETCH.SUCCESS', () => {
        const newState = reducer(initialState, fetchSuccess);
        expect(newState.actionGrant).toEqual(['list', 'create']);
      });
    });

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
