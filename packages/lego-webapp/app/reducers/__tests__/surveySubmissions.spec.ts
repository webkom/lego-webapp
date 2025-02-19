import { describe, it, expect } from 'vitest';
import { SurveySubmission } from 'app/actions/ActionTypes';
import surveySubmissions from '../surveySubmissions';

describe('reducers', () => {
  describe('surveySubmissions', () => {
    const baseState: ReturnType<typeof surveySubmissions> = {
      actionGrant: [],
      paginationNext: {},
      fetching: false,
      ids: [],
      entities: {},
    };
    it('SurveySubmission.ADD.SUCCESS adds survey id to submission object', () => {
      const action = {
        type: SurveySubmission.ADD.SUCCESS,
        meta: {
          surveyId: 9,
        },
        payload: {
          result: 3,
          entities: {
            surveySubmissions: {
              3: {
                id: 3,
                test: 'abc',
              },
            },
          },
        },
      };
      expect(surveySubmissions(baseState, action)).toEqual({
        ...baseState,
        ids: [3],
        entities: {
          3: {
            id: 3,
            test: 'abc',
            survey: 9,
          },
        },
      });
    });
  });
});
