import { createReducer } from '@reduxjs/toolkit';
import { ApiActionResultPayload } from 'app/actions/callAPI';
import type { DetailedArticle } from 'app/store/models/Article';
import { EntityType } from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';
import createLegoAdapter from 'app/utils/createLegoAdapter';
import type { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';

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
    describe('legacy AsyncActionTypes from other entity-types', () => {
      it('should add entities from legacy async fetch actions containing the relevant entity type', () => {
        const adapter = createLegoAdapter(EntityType.Articles);

        const initialState = adapter.getInitialState();
        const reducer = createReducer(initialState, adapter.buildReducers());

        expect(
          reducer(initialState, {
            type: 'SOMTHING_ELSE.FETCH.SUCCESS',
            success: true,
            payload: {
              actionGrant: ['ignored'],
              entities: {
                [EntityType.Articles]: {
                  42: article,
                },
              },
              result: ['irrelevantEntityId'],
              next: null,
              previous: null,
            } satisfies ApiActionResultPayload,
          })
        ).toEqual({
          ...initialState,
          ids: [42],
          entities: {
            42: article,
          },
        });
      });
    });

    describe('reducers specified in options', () => {
      it('should reduce cases specified in addCases', () => {
        const adapter = createLegoAdapter(EntityType.Articles);

        const initialState = adapter.getInitialState();
        const reducer = createReducer(
          initialState,
          adapter.buildReducers({
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
      it('should reduce matches to matchers specified addMatchers', () => {
        const adapter = createLegoAdapter(EntityType.Articles);

        const initialState = adapter.getInitialState();
        const reducer = createReducer(
          initialState,
          adapter.buildReducers({
            extraMatchers: (addMatcher) => {
              addMatcher(
                (action) => action.type.endsWith('Test'),
                (state) => {
                  state.actionGrant = ['expected'];
                }
              );
            },
          })
        );

        expect(reducer(initialState, { type: 'thisActionIsATest' })).toEqual({
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

    describe('reducing specified fetchTypes', () => {
      const adapter = createLegoAdapter(EntityType.Articles);
      let initialState: ReturnType<typeof adapter.getInitialState>;
      let reducer: ReducerWithInitialState<typeof initialState>;

      const ARTICLES_FETCH: AsyncActionType = {
        BEGIN: 'ARTICLES.FETCH.BEGIN',
        SUCCESS: 'ARTICLES.FETCH.SUCCESS',
        FAILURE: 'ARTICLES.FETCH.FAILURE',
      };

      const fetchBegin = {
        type: ARTICLES_FETCH.BEGIN,
      };

      const fetchSuccess = {
        type: ARTICLES_FETCH.SUCCESS,
        success: true,
        payload: {
          actionGrant: ['list', 'create'],
          entities: {
            [EntityType.Articles]: {
              42: article,
            },
          },
          result: ['42'],
          next: null,
          previous: null,
        } satisfies ApiActionResultPayload,
      };

      const fetchFailure = {
        type: ARTICLES_FETCH.FAILURE,
      };

      beforeEach(() => {
        initialState = adapter.getInitialState();
        reducer = createReducer(
          initialState,
          adapter.buildReducers({
            fetchActions: [ARTICLES_FETCH],
          })
        );
      });

      it('should set fetching=true on FETCH.BEGIN', () => {
        expect(reducer(initialState, fetchBegin)).toEqual({
          ...initialState,
          fetching: true,
        });
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

      it('should add entities form FETCH.SUCCESS', () => {
        const newState = reducer(initialState, fetchSuccess);
        expect(newState.ids).toEqual([42]);
        expect(newState.entities).toEqual({ 42: article });
      });

      it('should update actionGrant on FETCH.SUCCESS', () => {
        const newState = reducer(initialState, fetchSuccess);
        expect(newState.actionGrant).toEqual(['list', 'create']);
      });
    });
  });
});
