import { usePreparedEffect } from '@webkom/react-prepare';
import { produce } from 'immer';
import { createSelector } from 'reselect';
import { fetchSubmissions } from 'app/actions/SurveySubmissionActions';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import createEntityReducer from 'app/utils/createEntityReducer';
import { SurveySubmission } from '../actions/ActionTypes';
import type { AnyAction, EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { SurveySubmission as SurveySubmissionType } from 'app/store/models/SurveySubmission';
import type { EntityReducerState } from 'app/utils/createEntityReducer';

type State = EntityReducerState<SurveySubmissionType>;
const mutateSurveySubmissions = produce(
  (newState: State, action: AnyAction): void => {
    switch (action.type) {
      case SurveySubmission.ADD.SUCCESS: {
        const { surveyId } = action.meta;
        const id = action.payload.result;
        const surveySubmission = action.payload.entities.surveySubmissions[id];
        newState.byId[id] = { ...surveySubmission, survey: surveyId };
        break;
      }

      default:
        break;
    }
  },
);
export default createEntityReducer({
  key: 'surveySubmissions',
  types: {
    fetch: [SurveySubmission.FETCH, SurveySubmission.FETCH_ALL],
    mutate: SurveySubmission.ADD,
  },
  mutate: mutateSurveySubmissions,
});

export const selectSurveySubmissions = createSelector(
  (_: RootState, props: { surveyId: EntityId }) => props.surveyId,
  (state: RootState) => state.surveySubmissions.items,
  (state: RootState) => state.surveySubmissions.byId,
  (surveyId, surveySubmissionIds, surveySubmissionsById) =>
    surveySubmissionIds
      .map((surveySubmissionId) => surveySubmissionsById[surveySubmissionId])
      .filter((surveySubmission) => surveySubmission.survey === surveyId),
);
export const selectSurveySubmissionForUser = createSelector(
  (state: RootState, props: { surveyId: EntityId }) =>
    selectSurveySubmissions(state, props),
  (_: RootState, props: { currentUserId: EntityId }) => props.currentUserId,
  (submissions, userId) =>
    submissions.find((surveySubmission) => surveySubmission.user === userId),
);

export const useFetchedSurveySubmissions = (
  prepareId: string,
  surveyId?: EntityId,
): SurveySubmissionType[] => {
  const dispatch = useAppDispatch();
  usePreparedEffect(
    `useFetchedSurveySubmissions-${prepareId}`,
    () => surveyId && dispatch(fetchSubmissions(surveyId)),
    [surveyId],
  );
  return useAppSelector((state: RootState) =>
    selectSurveySubmissions(state, { surveyId: Number(surveyId) }),
  );
};
