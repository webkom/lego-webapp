import { createReducer } from '@reduxjs/toolkit';
import { generateStatuses } from 'app/actions/ActionTypes';
import { ApiActionResultPayload } from 'app/actions/callAPI';
import type { DetailedArticle } from 'app/store/models/Article';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { AsyncFetchActionSuccess } from 'app/utils/legoAdapter/legacyAsyncActions';
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
        paginationNext: {},
      });
    });
    it('should allow additional initial state to be added', () => {
      const adapter = createLegoAdapter(EntityType.Articles);

      expect(adapter.getInitialState({ smashed: false })).toEqual({
        actionGrant: [],
        ids: [],
        entities: {},
        fetching: false,
        paginationNext: {},
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
            meta: {
              schemaKey: EntityType.FeedActivities,
            },
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

    describe('extra reducers cases/matchers/default case', () => {
      const FETCH = generateStatuses('FETCH');

      it('should reduce cases specified in builderCallback', () => {
        const adapter = createLegoAdapter(EntityType.Articles, {
          fetchActions: [FETCH],
        });
        const initialState = adapter.getInitialState();
        const reducer = createReducer(
          initialState,
          adapter.buildReducers((builder) => {
            builder.addCase('testAction', (state) => {
              state.actionGrant = ['expected'];
            });
          })
        );

        expect(reducer(initialState, { type: 'testAction' })).toEqual({
          ...initialState,
          actionGrant: ['expected'],
        });
      });
      it('should reduce matchers specified in builderCallback', () => {
        const adapter = createLegoAdapter(EntityType.Articles, {
          fetchActions: [FETCH],
        });
        const initialState = adapter.getInitialState();
        const reducer = createReducer(
          initialState,
          adapter.buildReducers((builder) => {
            builder.addMatcher(
              ({ type }) => type.includes('test'),
              (state) => {
                state.actionGrant = ['expected'];
              }
            );
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
          adapter.buildReducers(
            () => {},
            (state) => {
              state.actionGrant = ['expected'];
            }
          )
        );

        expect(reducer(initialState, { type: 'thisActionIsATest' })).toEqual({
          ...initialState,
          actionGrant: ['expected'],
        });
      });
    });

    describe('reducing specified fetchTypes', () => {
      const ARTICLES_FETCH = generateStatuses('ARTICLES.FETCH');

      const adapter = createLegoAdapter(EntityType.Articles, {
        fetchActions: [ARTICLES_FETCH],
      });
      let initialState: ReturnType<typeof adapter.getInitialState>;
      let reducer: ReducerWithInitialState<typeof initialState>;

      const fetchBegin = {
        type: ARTICLES_FETCH.BEGIN,
        meta: {},
      };

      const fetchSuccess: AsyncFetchActionSuccess = {
        type: ARTICLES_FETCH.SUCCESS,
        payload: {
          actionGrant: ['list', 'create'],
          entities: {
            [EntityType.Articles]: {
              42: article,
            },
          },
          result: [42],
          next: 'url?cursor=c123',
        },
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

      const fetchFailure = {
        type: ARTICLES_FETCH.FAILURE,
      };

      beforeEach(() => {
        initialState = adapter.getInitialState();
        reducer = createReducer(initialState, adapter.buildReducers());
      });

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

      it('should update pagination on FETCH.SUCCESS', () => {
        const newState = reducer(initialState, fetchSuccess);
        expect(newState.paginationNext).toEqual({
          test: {
            query: {},
            ids: [42],
            hasMore: true,
            hasMoreBackwards: false,
            next: {
              cursor: 'c123',
            },
          },
        });
      });
    });

    describe('reducing specified deleteTypes', () => {
      const ARTICLES_DELETE = generateStatuses('ARTICLES.DELETE');

      const adapter = createLegoAdapter(EntityType.Articles, {
        deleteActions: [ARTICLES_DELETE],
      });
      const initialState = {
        ...adapter.getInitialState(),
        ids: [42],
        entities: {
          42: article,
        },
      };
      const reducer = createReducer(initialState, adapter.buildReducers());

      const deleteBegin = {
        type: ARTICLES_DELETE.BEGIN,
        meta: {
          id: 42,
        },
      };
      const deleteFailure = {
        type: ARTICLES_DELETE.FAILURE,
        meta: {
          id: 42,
        },
      };
      const deleteSuccess = {
        type: ARTICLES_DELETE.SUCCESS,
        payload: [],
        meta: {
          id: 42,
        },
      };

      it('should optimistically delete', () => {
        expect(reducer(initialState, deleteBegin)).toEqual({
          ...initialState,
          ids: [],
        });
      });
      it('should reverse optimistic delete', () => {
        const newState = reducer(
          reducer(initialState, deleteBegin),
          deleteFailure
        );
        expect(newState).toEqual(initialState);
      });
      it('should delete', () => {
        const newState = reducer(
          reducer(initialState, deleteBegin),
          deleteSuccess
        );
        expect(newState).toEqual({
          ...initialState,
          ids: [],
          entities: {},
        });
      });
    });
  });
});
