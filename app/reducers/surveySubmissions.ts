import { SurveySubmission } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import mergeObjects from 'app/utils/mergeObjects';

function mutateSurveySubmissions(state, action) {
  switch (action.type) {
    case SurveySubmission.ADD.SUCCESS: {
      const { surveyId } = action.meta;
      const id = action.payload.result;
      const surveySubmission = action.payload.entities.surveySubmissions[id];
      return mergeObjects(state, {
        byId: {
          [id]: { ...surveySubmission, survey: surveyId }
        }
      });
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

export const selectSurveySubmissionForUser = createSelector(
  (state, props) => selectSurveySubmissions(state, props),
  (state, props) => props.currentUser,
  (submissionsById, user) =>
    submissionsById.find(
      surveySubmission => surveySubmission.user.id === user.id
    )
);
