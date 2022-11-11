import { createReducer } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import { ArticlesState } from 'app/reducers/articles';
import type Article from 'app/store/models/Article';
import { EntityType } from 'app/store/models/Entities';
import { getInitialEntityReducerState } from 'app/store/utils/entityReducer';
import { addMutateReactionsReducer } from '../reactions';

describe('reducers', () => {
  describe('addMutateReactionsReducer', () => {
    const prevState: ArticlesState = {
      ...getInitialEntityReducerState(),
      items: [3, 4],
      byId: {
        3: {
          id: 3,
          text: 'hello world',
          title: 'welcome',
          reactionsGrouped: [
            {
              emoji: ':joy:',
              count: 1,
              hasReacted: false,
              unicodeString: '123',
            },
          ],
        } as Article,
        4: {
          id: 4,
          text: 'test',
          title: 'test',
          reactionsGrouped: [],
        } as Article,
      },
    };

    it('should add reaction to correct entity', () => {
      const reducer = createReducer(prevState, (builder) => {
        addMutateReactionsReducer(builder, EntityType.Articles);
      });

      const action = addReaction.success({
        meta: {
          contentTarget: 'articles.article-4',
          emoji: ':joy:',
          unicodeString: '123',
        } as any,
        payload: {
          entities: {
            reactions: {},
          },
          result: 33,
        },
      });

      expect(reducer(prevState, action)).toEqual(
        produce(prevState, (state) => {
          state.byId[4].reactionsGrouped = [
            {
              emoji: ':joy:',
              count: 1,
              hasReacted: true,
              reactionId: 33,
              unicodeString: '123',
            },
          ];
        })
      );
    });

    it('should group reactions', () => {
      const reducer = createReducer(prevState, (builder) => {
        addMutateReactionsReducer(builder, EntityType.Articles);
      });

      const action = addReaction.success({
        meta: {
          contentTarget: 'articles.article-3',
          emoji: ':joy:',
          unicodeString: '123',
        } as any,
        payload: {
          entities: {
            reactions: {},
          },
          result: 33,
        },
      });

      expect(reducer(prevState, action)).toEqual(
        produce(prevState, (state) => {
          state.byId[3].reactionsGrouped = [
            {
              emoji: ':joy:',
              count: 2,
              hasReacted: true,
              reactionId: 33,
              unicodeString: '123',
            },
          ];
        })
      );
    });

    it('should delete reaction correctly', () => {
      const prevState: ArticlesState = {
        ...getInitialEntityReducerState(),
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            text: 'hello world',
            title: 'welcome',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                count: 1,
                reactionId: 33,
                hasReacted: true,
                unicodeString: '123',
              },
            ],
          } as Article,
        },
      };

      const reducer = createReducer(prevState, (builder) => {
        addMutateReactionsReducer(builder, EntityType.Articles);
      });

      const action = deleteReaction.success({
        payload: null,
        meta: {
          contentTarget: 'articles.article-3',
          id: 33,
        } as any,
      });

      expect(reducer(prevState, action)).toEqual(
        produce(prevState, (state) => {
          state.byId[3].reactionsGrouped = [];
        })
      );
    });

    it('should not add reaction when entity is wrong', () => {
      const reducer = createReducer(prevState, (builder) => {
        addMutateReactionsReducer(builder, EntityType.Events);
      });

      const action = addReaction.success({
        meta: {
          contentTarget: 'articles.article-3',
          emoji: ':joy:',
          unicodeString: '123',
        } as any,
        payload: {
          entities: {
            reactions: {},
          },
          result: 33,
        },
      });

      expect(reducer(prevState, action)).toEqual(prevState);
    });
  });
});
