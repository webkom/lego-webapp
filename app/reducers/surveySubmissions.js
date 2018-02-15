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

export default createEntityReducer({
  key: 'surveySubmissions',
  types: {
    fetch: SurveySubmission.FETCH,
    mutate: SurveySubmission.ADD
  }
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

export const selectSurveySubmissionForUser = createSelector(
  (state, props) => selectSurveySubmissions(state, props),
  (state, props) => props.currentUser,
  (submissionsById, user) =>
    submissionsById.find(
      surveySubmission => surveySubmission.user.id === user.id
    )
);
