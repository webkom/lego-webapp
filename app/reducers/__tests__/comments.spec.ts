import { Comment } from 'app/actions/ActionTypes';
import type CommentType from 'app/store/models/Comment';
import comments, { mutateComments } from '../comments';

describe('reducers', () => {
  describe('comments', () => {
    it('Deleting comments should set text and author to null', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
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
describe('mutateComments', () => {
  const prevState = {
    actionGrant: [],
    pagination: {},
    items: [3, 4],
    byId: {
      3: {
        id: 3,
        text: 'hello world',
        name: 'welcome',
      },
      4: {
        id: 4,
        text: 'test',
        name: 'test',
      },
    },
  };
  const action = {
    type: Comment.ADD.SUCCESS,
    meta: {
      contentTarget: 'articles.article-3',
    },
    payload: {
      result: {
        id: 33,
        text: 'comment',
        author: {
          id: 1,
          username: 'webkom',
        },
        parent: null,
      },
    },
  };
  it('should add comment to correct entity', () => {
    const reducer = mutateComments('articles');
    expect(reducer(prevState, action)).toEqual({
      actionGrant: [],
      pagination: {},
      items: [3, 4],
      byId: {
        3: {
          id: 3,
          text: 'hello world',
          name: 'welcome',
          comments: [
            {
              id: 33,
              text: 'comment',
              author: {
                id: 1,
                username: 'webkom',
              },
              parent: null,
            },
          ],
        },
        4: {
          id: 4,
          text: 'test',
          name: 'test',
        },
      },
    });
  });
  it('should not add comment when entity is wrong', () => {
    const reducer = mutateComments('events');
    const newState = reducer(prevState, action);
    expect(newState).toEqual(prevState);
  });
});
