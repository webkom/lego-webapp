import { describe, it, expect } from 'vitest';
import { Toasts } from 'app/actions/ActionTypes';
import toasts from '../toasts';

describe('reducers', () => {
  describe('toasts', () => {
    it('Toasts should populate default state correctly', () => {
      const prevState = undefined;
      const randomAction = {};
      expect(toasts(prevState, randomAction)).toEqual({
        items: [],
      });
    });
    it('Toasts.TOAST_ADDED', () => {
      const prevState = {
        items: [
          {
            id: 1,
            message: 'yo',
            removed: true,
          },
        ],
      };
      const action = {
        type: Toasts.TOAST_ADDED,
        payload: {
          id: 2,
          message: 'hi',
          removed: false,
        },
      };
      expect(toasts(prevState, action)).toEqual({
        items: [
          {
            id: 1,
            message: 'yo',
            removed: true,
          },
          {
            id: 2,
            message: 'hi',
            removed: false,
          },
        ],
      });
    });
    it('Toasts.TOAST_REMOVED', () => {
      const prevState = {
        items: [
          {
            id: 1,
            message: 'yo',
            removed: false,
          },
        ],
      };
      const action = {
        type: Toasts.TOAST_REMOVED,
        payload: {
          id: 1,
        },
      };
      expect(toasts(prevState, action)).toEqual({
        items: [
          {
            id: 1,
            message: 'yo',
            removed: true,
          },
        ],
      });
    });
  });
});
