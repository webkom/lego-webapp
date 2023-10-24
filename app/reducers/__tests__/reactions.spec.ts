import { describe, it, expect } from 'vitest';
import { Reaction } from '../../actions/ActionTypes';
import { mutateReactions } from '../reactions';

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
});
