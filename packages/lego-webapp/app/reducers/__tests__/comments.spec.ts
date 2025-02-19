import { combineReducers, createSlice } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import { Comment } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import comments, { addCommentCases } from '../comments';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedArticle } from 'app/store/models/Article';
import type CommentType from 'app/store/models/Comment';
import type { ContentTarget } from 'app/store/utils/contentTarget';

describe('reducers', () => {
  describe('comments', () => {
    it('Deleting comments should set text and author to null', () => {
      const prevState = {
        actionGrant: [],
        paginationNext: {},
        ids: [91],
        entities: {
          91: {
            id: 91,
            text: 'hello world',
            author: {
              id: 1,
              username: 'webkom',
            },
            parent: null,
          } as CommentType,
        },
        fetching: false,
      };
      const action = {
        type: Comment.DELETE.SUCCESS,
        meta: {
          id: 91,
        },
      };
      expect(comments(prevState, action).entities[91]?.text).toBeNull();
      expect(comments(prevState, action).entities[91]?.author).toBeNull();
    });
  });
});

describe('addCommentCases', () => {
  const articlesAdapter = createLegoAdapter(EntityType.Articles);
  const initialArticlesState = {
    ...articlesAdapter.getInitialState(),
    ids: [2, 3],
    entities: {
      2: {
        id: 2,
        title: 'Article 1',
        comments: [] as EntityId[],
      } as DetailedArticle,
      3: {
        id: 3,
        title: 'Article 2',
        comments: [] as EntityId[],
      } as DetailedArticle,
    },
  };
  const articlesSlice = createSlice({
    name: EntityType.Articles,
    initialState: initialArticlesState,
    reducers: {},
    extraReducers: articlesAdapter.buildReducers({
      extraCases: (addCase) => {
        addCommentCases(EntityType.Articles, addCase);
      },
    }),
  });
  const eventsAdapter = createLegoAdapter(EntityType.Events);
  const eventsSlice = createSlice({
    name: EntityType.Events,
    initialState: eventsAdapter.getInitialState(),
    reducers: {},
  });
  const reducer = combineReducers({
    events: eventsSlice.reducer,
    articles: articlesSlice.reducer,
  });

  const action = (contentTarget: ContentTarget) => ({
    type: Comment.ADD.SUCCESS,
    meta: {
      contentTarget,
    },
    payload: {
      entities: {
        comments: {
          33: {
            id: 33,
            text: 'comment',
            author: {
              id: 1,
              username: 'webkom',
            },
            parent: null,
          },
        },
      },
      result: 33,
    },
  });

  it('should add comment id to the correct entity', () => {
    expect(reducer(undefined, action('articles.article-3'))).toEqual({
      articles: {
        ...articlesAdapter.getInitialState(),
        ids: [2, 3],
        entities: {
          2: {
            id: 2,
            title: 'Article 1',
            comments: [],
          },
          3: {
            id: 3,
            title: 'Article 2',
            comments: [33],
          },
        },
      },
      events: eventsAdapter.getInitialState(),
    });
  });
  it('should not add comment id with different contentTarget', () => {
    expect(reducer(undefined, action('events.event-3'))).toEqual({
      articles: initialArticlesState,
      events: eventsAdapter.getInitialState(),
    });
  });
});
