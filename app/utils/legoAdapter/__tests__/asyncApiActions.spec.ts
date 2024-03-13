import { describe, it, expect } from 'vitest';
import { generateStatuses } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import {
  isAsyncApiActionBegin,
  isAsyncApiActionFailure,
  isAsyncApiActionSuccess,
} from 'app/utils/legoAdapter/asyncApiActions';

describe('async action type guards', () => {
  const FETCH = generateStatuses('FETCH');
  const UPDATE = generateStatuses('UPDATE');

  const baseAction = {
    meta: {
      endpoint: '/something',
      schemaKey: 'something',
    },
  };

  describe('isAsyncApiActionSuccess', () => {
    it('should return true on SUCCESS actions', () => {
      expect(
        isAsyncApiActionSuccess({ ...baseAction, type: FETCH.SUCCESS })
      ).toBe(true);
      expect(
        isAsyncApiActionSuccess({ ...baseAction, type: UPDATE.SUCCESS })
      ).toBe(true);
    });
    it('should return false on other actions', () => {
      expect(
        isAsyncApiActionSuccess({ ...baseAction, type: FETCH.BEGIN })
      ).toBe(false);
      expect(
        isAsyncApiActionSuccess({ ...baseAction, type: FETCH.FAILURE })
      ).toBe(false);
      expect(
        isAsyncApiActionSuccess({ ...baseAction, type: UPDATE.BEGIN })
      ).toBe(false);
      expect(
        isAsyncApiActionSuccess({ ...baseAction, type: UPDATE.FAILURE })
      ).toBe(false);
    });

    describe('.matching', () => {
      it('should return true only if matching actionTypes', () => {
        expect(
          isAsyncApiActionSuccess.matching([FETCH])({
            ...baseAction,
            type: FETCH.SUCCESS,
          })
        ).toBe(true);
        expect(
          isAsyncApiActionSuccess.matching([FETCH])({
            ...baseAction,
            type: UPDATE.SUCCESS,
          })
        ).toBe(false);
      });
      it('should return false if not SUCCESS even if matching actionTypes', () => {
        expect(
          isAsyncApiActionSuccess.matching([FETCH])({
            ...baseAction,
            type: FETCH.BEGIN,
          })
        ).toBe(false);
        expect(
          isAsyncApiActionSuccess.matching([FETCH])({
            ...baseAction,
            type: FETCH.FAILURE,
          })
        ).toBe(false);
      });
    });
    describe('.containsEntity', () => {
      it('should return true when entity is in payload', () => {
        expect(
          isAsyncApiActionSuccess.containingEntity(EntityType.Articles)({
            ...baseAction,
            type: FETCH.SUCCESS,
            payload: {
              entities: {
                [EntityType.Articles]: {},
              },
            },
          })
        ).toBe(true);
        expect(
          isAsyncApiActionSuccess.containingEntity(EntityType.Events)({
            ...baseAction,
            type: FETCH.SUCCESS,
            payload: {
              entities: {
                [EntityType.Events]: {},
              },
            },
          })
        ).toBe(true);
      });
      it('should return false when entity is not in payload', () => {
        expect(
          isAsyncApiActionSuccess.containingEntity(EntityType.Articles)({
            ...baseAction,
            type: FETCH.SUCCESS,
            payload: {
              entities: {
                [EntityType.Emojis]: {},
              },
            },
          })
        ).toBe(false);
        expect(
          isAsyncApiActionSuccess.containingEntity(EntityType.Events)({
            ...baseAction,
            type: FETCH.SUCCESS,
            payload: {
              entities: {
                [EntityType.Announcements]: {},
              },
            },
          })
        ).toBe(false);
      });
    });
  });
  describe('isAsyncApiActionFailure', () => {
    it('should return true on FAILURE actions', () => {
      expect(
        isAsyncApiActionFailure({ ...baseAction, type: FETCH.FAILURE })
      ).toBe(true);
      expect(
        isAsyncApiActionFailure({ ...baseAction, type: UPDATE.FAILURE })
      ).toBe(true);
    });
    it('should return false on other actions', () => {
      expect(
        isAsyncApiActionFailure({ ...baseAction, type: FETCH.BEGIN })
      ).toBe(false);
      expect(
        isAsyncApiActionFailure({ ...baseAction, type: FETCH.SUCCESS })
      ).toBe(false);
      expect(
        isAsyncApiActionFailure({ ...baseAction, type: UPDATE.BEGIN })
      ).toBe(false);
      expect(
        isAsyncApiActionFailure({ ...baseAction, type: UPDATE.SUCCESS })
      ).toBe(false);
    });

    describe('.matching', () => {
      it('should return true only if matching actionTypes', () => {
        expect(
          isAsyncApiActionFailure.matching([FETCH])({
            ...baseAction,
            type: FETCH.FAILURE,
          })
        ).toBe(true);
        expect(
          isAsyncApiActionFailure.matching([FETCH])({
            ...baseAction,
            type: UPDATE.FAILURE,
          })
        ).toBe(false);
      });
      it('should return false if not SUCCESS even if matching actionTypes', () => {
        expect(
          isAsyncApiActionFailure.matching([FETCH])({
            ...baseAction,
            type: FETCH.BEGIN,
          })
        ).toBe(false);
        expect(
          isAsyncApiActionFailure.matching([FETCH])({
            ...baseAction,
            type: FETCH.SUCCESS,
          })
        ).toBe(false);
      });
    });
  });
  describe('isAsyncApiActionBegin', () => {
    it('should return true on FAILURE actions', () => {
      expect(isAsyncApiActionBegin({ ...baseAction, type: FETCH.BEGIN })).toBe(
        true
      );
      expect(isAsyncApiActionBegin({ ...baseAction, type: UPDATE.BEGIN })).toBe(
        true
      );
    });
    it('should return false on other actions', () => {
      expect(
        isAsyncApiActionBegin({ ...baseAction, type: FETCH.FAILURE })
      ).toBe(false);
      expect(
        isAsyncApiActionBegin({ ...baseAction, type: FETCH.SUCCESS })
      ).toBe(false);
      expect(
        isAsyncApiActionBegin({ ...baseAction, type: UPDATE.FAILURE })
      ).toBe(false);
      expect(
        isAsyncApiActionBegin({ ...baseAction, type: UPDATE.SUCCESS })
      ).toBe(false);
    });

    describe('.matching', () => {
      it('should return true only if matching actionTypes', () => {
        expect(
          isAsyncApiActionBegin.matching([FETCH])({
            ...baseAction,
            type: FETCH.BEGIN,
          })
        ).toBe(true);
        expect(
          isAsyncApiActionBegin.matching([FETCH])({
            ...baseAction,
            type: UPDATE.BEGIN,
          })
        ).toBe(false);
      });
      it('should return false if not SUCCESS even if matching actionTypes', () => {
        expect(
          isAsyncApiActionBegin.matching([FETCH])({
            ...baseAction,
            type: FETCH.FAILURE,
          })
        ).toBe(false);
        expect(
          isAsyncApiActionBegin.matching([FETCH])({
            ...baseAction,
            type: FETCH.SUCCESS,
          })
        ).toBe(false);
      });
    });
  });
});
