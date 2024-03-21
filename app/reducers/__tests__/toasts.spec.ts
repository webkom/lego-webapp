import { describe, it, expect } from 'vitest';
import toasts, { addToast, removeToast } from '../toasts';

describe('reducers', () => {
  describe('toasts', () => {
    it('Toasts should populate default state correctly', () => {
      const prevState = undefined;
      const randomAction = {
        type: 'random',
      };
      expect(toasts(prevState, randomAction)).toEqual({
        items: [],
      });
    });
    it('toasts/addToast', () => {
      const prevState: ReturnType<typeof toasts> = {
        items: [
          {
            id: 1,
            message: 'yo',
            dismissAfter: 5000,
            removed: true,
          },
        ],
      };
      const action = addToast({ id: 2, message: 'hi' });
      expect(toasts(prevState, action)).toEqual({
        items: [
          {
            id: 1,
            message: 'yo',
            dismissAfter: 5000,
            removed: true,
          },
          {
            id: 2,
            message: 'hi',
            dismissAfter: 5000,
            removed: false,
          },
        ],
      });
    });
    it('toasts/removeToast', () => {
      const prevState: ReturnType<typeof toasts> = {
        items: [
          {
            id: 1,
            message: 'yo',
            dismissAfter: 5000,
            removed: false,
          },
        ],
      };
      const action = removeToast(1);
      expect(toasts(prevState, action)).toEqual({
        items: [
          {
            id: 1,
            message: 'yo',
            dismissAfter: 5000,
            removed: true,
          },
        ],
      });
    });
  });
});
