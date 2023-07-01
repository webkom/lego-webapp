import { createSlice } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import { Reaction } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { addReactionCases, mutateReactions } from '../reactions';
import type { DetailedArticle } from 'app/store/models/Article';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ContentTarget } from 'app/store/utils/contentTarget';

describe('reducers', () => {
  describe('mutateReactions', () => {
    const prevState = {
      actionGrant: [],
      pagination: {},
      items: [3, 4],
      byId: {
        3: {
          id: 3,
          text: 'hello world',
          name: 'welcome',
          reactionsGrouped: [
            {
              emoji: ':joy:',
              count: 1,
              hasReacted: false,
              unicodeString: '123',
            },
          ],
        },
        4: {
          id: 4,
          text: 'test',
          name: 'test',
          reactionsGrouped: [],
        },
      },
    };
    it('should add reaction to correct entity', () => {
      const reducer = mutateReactions('articles');
      const action = {
        type: Reaction.ADD.SUCCESS,
        meta: {
          contentTarget: 'articles.article-4',
          emoji: ':joy:',
          unicodeString: '123',
        },
        payload: {
          id: 33,
          emoji: ':pizza:',
        },
      };
      expect(reducer(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4],
        byId: {
          3: {
            id: 3,
            text: 'hello world',
            name: 'welcome',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                count: 1,
                hasReacted: false,
                unicodeString: '123',
              },
            ],
          },
          4: {
            id: 4,
            text: 'test',
            name: 'test',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                count: 1,
                hasReacted: true,
                reactionId: 33,
                unicodeString: '123',
              },
            ],
          },
        },
      });
    });
    it('should group reactions', () => {
      const reducer = mutateReactions('articles');
      const action = {
        type: Reaction.ADD.SUCCESS,
        meta: {
          contentTarget: 'articles.article-3',
          emoji: ':joy:',
          unicodeString: '123',
        },
        payload: {
          id: 33,
          emoji: ':pizza:',
        },
      };
      expect(reducer(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4],
        byId: {
          3: {
            id: 3,
            text: 'hello world',
            name: 'welcome',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                count: 2,
                hasReacted: true,
                reactionId: 33,
                unicodeString: '123',
              },
            ],
          },
          4: {
            id: 4,
            text: 'test',
            name: 'test',
            reactionsGrouped: [],
          },
        },
      });
    });
    it('should delete reaction correctly', () => {
      const reducer = mutateReactions('articles');
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            text: 'hello world',
            name: 'welcome',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                count: 1,
                reactionId: 33,
                hasReacted: true,
                unicodeString: '123',
              },
            ],
          },
        },
      };
      const action = {
        type: Reaction.DELETE.SUCCESS,
        meta: {
          contentTarget: 'articles.article-3',
          id: 33,
        },
      };
      expect(reducer(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            text: 'hello world',
            name: 'welcome',
            reactionsGrouped: [],
          },
        },
      });
    });
    it('should not add reaction when entity is wrong', () => {
      const reducer = mutateReactions('events');
      const action = {
        type: Reaction.ADD.SUCCESS,
        meta: {
          contentTarget: 'articles.article-3',
          emoji: ':joy:',
          unicodeString: '123',
        },
        payload: {
          id: 33,
          emoji: ':pizza:',
        },
      };
      const newState = reducer(prevState, action);
      expect(newState).toEqual(prevState);
    });
  });

  describe('addReactionCases', () => {
    const articlesAdapter = createLegoAdapter(EntityType.Articles);
    const createInitialState = (
      article1HasReacted: boolean,
      article1ReactionCount: number
    ) => ({
      ...articlesAdapter.getInitialState(),
      ids: [2, 3],
      entities: {
        2: {
          id: 2,
          title: 'Article 1',
          reactionsGrouped: [
            {
              emoji: ':joy:',
              unicodeString: '123',
              count: article1ReactionCount,
              hasReacted: article1HasReacted,
              reactionId: article1HasReacted ? 33 : undefined,
            },
          ],
        } as DetailedArticle,
        3: {
          id: 3,
          title: 'Article 2',
          reactionsGrouped: [] as ReactionsGrouped[],
        } as DetailedArticle,
      },
    });
    const articlesSlice = createSlice({
      name: EntityType.Articles,
      initialState: createInitialState(false, 1),
      reducers: {},
      extraReducers: articlesAdapter.buildReducers({
        extraCases: (addCase) => {
          addReactionCases(EntityType.Articles, addCase);
        },
      }),
    });
    const reducer = articlesSlice.reducer;

    const add = (contentTarget: ContentTarget) => ({
      type: Reaction.ADD.SUCCESS,
      meta: {
        contentTarget,
        emoji: ':joy:',
        unicodeString: '123',
      },
      payload: {
        id: 33,
        emoji: ':pizza:',
      },
    });

    const remove = (contentTarget: ContentTarget) => ({
      type: Reaction.DELETE.SUCCESS,
      meta: {
        contentTarget,
        id: 33,
      },
    });

    it('should add reaction to entity', () => {
      const initialState = createInitialState(false, 1);
      expect(reducer(initialState, add('articles.article-3'))).toEqual({
        ...initialState,
        entities: {
          2: {
            id: 2,
            title: 'Article 1',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                unicodeString: '123',
                count: 1,
                hasReacted: false,
              },
            ],
          },
          3: {
            id: 3,
            title: 'Article 2',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                unicodeString: '123',
                count: 1,
                hasReacted: true,
                reactionId: 33,
              },
            ],
          },
        },
      });
    });
    it('should group reactions', () => {
      const initialState = createInitialState(false, 1);
      expect(reducer(initialState, add('articles.article-2'))).toEqual({
        ...initialState,
        entities: {
          2: {
            id: 2,
            title: 'Article 1',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                unicodeString: '123',
                count: 2,
                hasReacted: true,
                reactionId: 33,
              },
            ],
          },
          3: {
            id: 3,
            title: 'Article 2',
            reactionsGrouped: [],
          },
        },
      });
    });
    it('should delete reaction from entity', () => {
      const initialState = createInitialState(true, 1);
      expect(reducer(initialState, remove('articles.article-2'))).toEqual({
        ...initialState,
        entities: {
          2: {
            id: 2,
            title: 'Article 1',
            reactionsGrouped: [],
          },
          3: {
            id: 3,
            title: 'Article 2',
            reactionsGrouped: [],
          },
        },
      });
    });
    it('should remove grouped reaction', () => {
      const initialState = createInitialState(true, 4);
      expect(reducer(initialState, remove('articles.article-2'))).toEqual({
        ...initialState,
        entities: {
          2: {
            id: 2,
            title: 'Article 1',
            reactionsGrouped: [
              {
                emoji: ':joy:',
                count: 3,
                hasReacted: false,
                unicodeString: '123',
              },
            ],
          },
          3: {
            id: 3,
            title: 'Article 2',
            reactionsGrouped: [],
          },
        },
      });
    });
    it('should not add reaction to wrong contentTarget', () => {
      const initialState = createInitialState(false, 1);
      expect(reducer(initialState, add('events.event-2'))).toEqual(
        initialState
      );
    });
  });
});
