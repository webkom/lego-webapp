import toasts, { addToast, removeToast } from '../toasts';

describe('reducers', () => {
  describe('toasts', () => {
    it('Toasts should populate default state correctly', () => {
      const prevState = undefined;
      expect(toasts(prevState, { type: 'RANDOM' })).toEqual({
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
      const action = addToast({
        id: 2,
        message: 'hi',
      });
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
      const action = removeToast(1);
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
