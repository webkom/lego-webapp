import { createReducer } from '@reduxjs/toolkit';
import { addComment, deleteComment } from 'app/actions/CommentActions';
import { ArticlesState } from 'app/reducers/articles';
import type Article from 'app/store/models/Article';
import type Comment from 'app/store/models/Comment';
import { EntityType } from 'app/store/models/Entities';
import type User from 'app/store/models/User';
import { getInitialEntityReducerState } from 'app/store/utils/entityReducer';
import comments, { addMutateCommentsReducer, CommentsState } from '../comments';

const webkomUser: User = {
  id: 1,
  username: 'webkom',
} as User;

const addedComment: Comment = {
  id: 33,
  text: 'comment',
  author: webkomUser,
  parent: null,
  createdAt: '2022-11-11T18:53:50.602779Z',
  updatedAt: '2022-11-11T18:53:50.602779Z',
};

describe('reducers', () => {
  describe('comments', () => {
    const prevState: CommentsState = {
      ...getInitialEntityReducerState(),
      items: [91],
      byId: {
        91: {
          id: 91,
          text: 'hello world',
          author: webkomUser,
          parent: null,
        } as Comment,
      },
    };

    it('should add a new comment to the store', () => {
      const action = addComment.success({
        meta: {
          contentTarget: 'articles.article-1',
        } as any,
        payload: {
          result: 33,
          entities: {
            comments: {
              33: addedComment,
            },
          },
        },
      });

      expect(comments(prevState, action)).toEqual({
        ...prevState,
        byId: {
          ...prevState.byId,
          33: addedComment,
        },
        items: [...prevState.items, 33],
      });
    });

    it('should set text and author to null when deleting comment', () => {
      const action = deleteComment.success({
        meta: {
          id: 91,
        },
      } as any);
      expect(comments(prevState, action).byId[91].text).toBeNull();
      expect(comments(prevState, action).byId[91].author).toBeNull();
    });
  });
});

describe('addMutateCommentsReducer', () => {
  const prevState: ArticlesState = {
    ...getInitialEntityReducerState(),
    items: [3, 4],
    byId: {
      3: {
        id: 3,
        text: 'hello world',
        title: 'welcome',
      } as Article,
      4: {
        id: 4,
        text: 'test',
        title: 'test',
      } as Article,
    },
  };

  const action: ReturnType<typeof addComment.success> = {
    type: addComment.success.type,
    meta: {
      contentTarget: 'articles.article-3',
    } as any,
    success: true,
    payload: {
      entities: {
        comments: {
          33: addedComment,
        },
      },
      result: 33,
    },
  };

  it('should add comment to correct entity', () => {
    const reducer = createReducer(prevState, (builder) => {
      addMutateCommentsReducer(builder, EntityType.Articles);
    });

    expect(reducer(prevState, action)).toEqual({
      ...prevState,
      byId: {
        ...prevState.byId,
        3: {
          ...prevState.byId[3],
          comments: [33],
        },
      },
    });
  });

  it('should not add comment when entity is wrong', () => {
    const reducer = createReducer(prevState, (builder) => {
      addMutateCommentsReducer(builder, EntityType.Events);
    });

    const newState = reducer(prevState, action);
    expect(newState).toEqual(prevState);
  });
});
