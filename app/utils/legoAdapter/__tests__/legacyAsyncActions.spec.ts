import { generateStatuses } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import {
  isAsyncActionBegin,
  isAsyncActionFailure,
  isAsyncActionSuccess,
} from 'app/utils/legoAdapter/legacyAsyncActions';

describe('async action type guards', () => {
  const FETCH = generateStatuses('FETCH');
  const UPDATE = generateStatuses('UPDATE');

  describe('isAsyncActionSuccess', () => {
    it('should return true on SUCCESS actions', () => {
      expect(isAsyncActionSuccess({ type: FETCH.SUCCESS, meta: {} })).toBe(
        true
      );
      expect(isAsyncActionSuccess({ type: UPDATE.SUCCESS, meta: {} })).toBe(
        true
      );
    });
    it('should return false on other actions', () => {
      expect(isAsyncActionSuccess({ type: FETCH.BEGIN })).toBe(false);
      expect(isAsyncActionSuccess({ type: FETCH.FAILURE })).toBe(false);
      expect(isAsyncActionSuccess({ type: UPDATE.BEGIN })).toBe(false);
      expect(isAsyncActionSuccess({ type: UPDATE.FAILURE })).toBe(false);
    });

    describe('.matching', () => {
      it('should return true only if matching actionTypes', () => {
        expect(
          isAsyncActionSuccess.matching([FETCH])({ type: FETCH.SUCCESS })
        ).toBe(true);
        expect(
          isAsyncActionSuccess.matching([FETCH])({ type: UPDATE.SUCCESS })
        ).toBe(false);
      });
      it('should return false if not SUCCESS even if matching actionTypes', () => {
        expect(
          isAsyncActionSuccess.matching([FETCH])({ type: FETCH.BEGIN })
        ).toBe(false);
        expect(
          isAsyncActionSuccess.matching([FETCH])({ type: FETCH.FAILURE })
        ).toBe(false);
      });
    });
    describe('.containsEntity', () => {
      it('should return true when entity is in payload', () => {
        expect(
          isAsyncActionSuccess.containingEntity(EntityType.Articles)({
            type: FETCH.SUCCESS,
            meta: {},
            payload: {
              entities: {
                [EntityType.Articles]: {},
              },
            },
          })
        ).toBe(true);
        expect(
          isAsyncActionSuccess.containingEntity(EntityType.Events)({
            type: FETCH.SUCCESS,
            meta: {},
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
          isAsyncActionSuccess.containingEntity(EntityType.Articles)({
            type: FETCH.SUCCESS,
            payload: {
              entities: {
                [EntityType.Emojis]: {},
              },
            },
          })
        ).toBe(false);
        expect(
          isAsyncActionSuccess.containingEntity(EntityType.Events)({
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
  describe('isAsyncActionFailure', () => {
    it('should return true on FAILURE actions', () => {
      expect(isAsyncActionFailure({ type: FETCH.FAILURE })).toBe(true);
      expect(isAsyncActionFailure({ type: UPDATE.FAILURE })).toBe(true);
    });
    it('should return false on other actions', () => {
      expect(isAsyncActionFailure({ type: FETCH.BEGIN })).toBe(false);
      expect(isAsyncActionFailure({ type: FETCH.SUCCESS })).toBe(false);
      expect(isAsyncActionFailure({ type: UPDATE.BEGIN })).toBe(false);
      expect(isAsyncActionFailure({ type: UPDATE.SUCCESS })).toBe(false);
    });

    describe('.matching', () => {
      it('should return true only if matching actionTypes', () => {
        expect(
          isAsyncActionFailure.matching([FETCH])({ type: FETCH.FAILURE })
        ).toBe(true);
        expect(
          isAsyncActionFailure.matching([FETCH])({ type: UPDATE.FAILURE })
        ).toBe(false);
      });
      it('should return false if not SUCCESS even if matching actionTypes', () => {
        expect(
          isAsyncActionFailure.matching([FETCH])({ type: FETCH.BEGIN })
        ).toBe(false);
        expect(
          isAsyncActionFailure.matching([FETCH])({ type: FETCH.SUCCESS })
        ).toBe(false);
      });
    });
  });
  describe('isAsyncActionBegin', () => {
    it('should return true on FAILURE actions', () => {
      expect(isAsyncActionBegin({ type: FETCH.BEGIN })).toBe(true);
      expect(isAsyncActionBegin({ type: UPDATE.BEGIN })).toBe(true);
    });
    it('should return false on other actions', () => {
      expect(isAsyncActionBegin({ type: FETCH.FAILURE })).toBe(false);
      expect(isAsyncActionBegin({ type: FETCH.SUCCESS })).toBe(false);
      expect(isAsyncActionBegin({ type: UPDATE.FAILURE })).toBe(false);
      expect(isAsyncActionBegin({ type: UPDATE.SUCCESS })).toBe(false);
    });

    describe('.matching', () => {
      it('should return true only if matching actionTypes', () => {
        expect(
          isAsyncActionBegin.matching([FETCH])({ type: FETCH.BEGIN })
        ).toBe(true);
        expect(
          isAsyncActionBegin.matching([FETCH])({ type: UPDATE.BEGIN })
        ).toBe(false);
      });
      it('should return false if not SUCCESS even if matching actionTypes', () => {
        expect(
          isAsyncActionBegin.matching([FETCH])({ type: FETCH.FAILURE })
        ).toBe(false);
        expect(
          isAsyncActionBegin.matching([FETCH])({ type: FETCH.SUCCESS })
        ).toBe(false);
      });
    });
  });
});
