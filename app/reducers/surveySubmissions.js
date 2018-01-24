// @flow

import { SurveySubmission } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import type { OptionEntity, SurveyEntity, QuestionEntity } from './surveys';
import type { UserEntity } from 'app/reducers/users';

export type SubmissionEntity = {
  id: number,
  user: UserEntity,
  survey: SurveyEntity,
  submitted: boolean,
  submittedTime?: string,
  answers: Array<AnswerEntity>
};

export type AnswerEntity = {
  id: number,
  submission: SubmissionEntity,
  question: QuestionEntity,
  answerText: string,
  selectedOptions: Array<OptionEntity>
};

function mutateSurveySubmissions(state, action) {
  switch (action.type) {
    case SurveySubmission.FETCH.SUCCESS: {
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.id)
      };
    }

    default:
      return state;
  }
}

export default createEntityReducer({
  key: 'surveySubmissions',
  types: {
    fetch: SurveySubmission.FETCH,
    mutate: SurveySubmission.ADD
  },
  mutate: mutateSurveySubmissions
});

export const selectSurveySubmissions = createSelector(
  (state, props) => props.surveyId,
  state => state.surveySubmissions.items,
  state => state.surveySubmissions.byId,
  state => state.users.byId,
  (surveyId, surveySubmissionIds, surveySubmissionsById, usersById) =>
    surveySubmissionIds
      .map(surveySubmissionId => {
        const submission = surveySubmissionsById[surveySubmissionId];
        return {
          ...submission,
          user: usersById[submission.user]
        };
      })
      .filter(surveySubmission => surveySubmission.survey === surveyId)
);
