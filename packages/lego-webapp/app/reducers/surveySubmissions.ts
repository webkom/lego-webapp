import { createSlice } from '@reduxjs/toolkit';
import { usePreparedEffect } from '@webkom/react-prepare';
import { createSelector } from 'reselect';
import { fetchSubmissions } from 'app/actions/SurveySubmissionActions';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { SurveySubmission } from '../actions/ActionTypes';
import type { AnyAction, EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { SurveySubmission as SurveySubmissionType } from 'app/store/models/SurveySubmission';

const legoAdapter = createLegoAdapter(EntityType.SurveySubmissions);

const surveySubmissionsSlice = createSlice({
  name: EntityType.SurveySubmissions,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [SurveySubmission.FETCH, SurveySubmission.FETCH_ALL],
    extraCases: (addCase) => {
      addCase(SurveySubmission.ADD.SUCCESS, (state, action: AnyAction) => {
        const { surveyId } = action.meta;
        const id = action.payload.result;
        const surveySubmission = action.payload.entities.surveySubmissions[id];
        legoAdapter.upsertOne(state, { ...surveySubmission, survey: surveyId });
      });
    },
  }),
});

export default surveySubmissionsSlice.reducer;
const { selectByField: selectSurveySubmissionsByField } =
  legoAdapter.getSelectors((state: RootState) => state.surveySubmissions);

export const selectSurveySubmissionsBySurveyId =
  selectSurveySubmissionsByField('survey');

export const selectOwnSurveySubmission = createSelector(
  (state: RootState, props: { surveyId: EntityId }) =>
    selectSurveySubmissionsBySurveyId(state, props.surveyId),
  (submissions) =>
    submissions.find((surveySubmission) => surveySubmission.isOwner),
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
    selectSurveySubmissionsBySurveyId(state, Number(surveyId)),
  );
};
