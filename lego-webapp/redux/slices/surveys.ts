import { createSlice } from '@reduxjs/toolkit';
import { usePreparedEffect } from '@webkom/react-prepare';
import { omit } from 'lodash-es';
import { createSelector } from 'reselect';
import { Survey } from '~/redux/actionTypes';
import {
  fetchSurvey,
  fetchTemplate,
  fetchWithToken,
} from '~/redux/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { selectEventById } from './events';
import type { EntityId } from '@reduxjs/toolkit';
import type { Overwrite } from 'utility-types';
import type { EventForSurvey } from '~/redux/models/Event';
import type {
  DetailedSurvey,
  PublicResultsSurvey,
  UnknownSurvey,
} from '~/redux/models/Survey';
import type {
  SurveyQuestion,
  SurveyQuestionOption,
} from '~/redux/models/SurveyQuestion';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Surveys);

const surveysSlice = createSlice({
  name: EntityType.Surveys,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Survey.FETCH],
  }),
});

export default surveysSlice.reducer;

export const {
  selectAll,
  selectById: selectSurveyById,
  selectByField: selectSurveysByField,
} = legoAdapter.getSelectors((state: RootState) => state.surveys);

export const selectAllSurveys = createSelector(selectAll, (surveys) =>
  surveys.filter((survey) => !survey.isTemplate),
);

export const selectAllAttendedBySelfSurveys = createSelector(
  selectAllSurveys,
  (surveys) => surveys.filter((survey) => survey.attendedBySelf),
);

export const selectSurveyTemplates = createSelector(selectAll, (surveys) =>
  surveys.filter((survey) => survey.isTemplate),
);

export type TransformedSurveyTemplate = Overwrite<
  Omit<DetailedSurvey, 'id' | 'event' | 'activeFrom'>,
  {
    questions: Overwrite<
      Omit<SurveyQuestion, 'id'>,
      {
        options: Omit<SurveyQuestionOption, 'id'>[];
      }
    >[];
  }
>;
export const selectSurveyTemplateById = createSelector(
  selectSurveyById,
  (template) => {
    if (!template || !('actionGrant' in template)) return undefined;
    const questions = (template.questions || []).map((question) => ({
      ...omit(question, 'id'),
      options: question.options.map((option) => omit(option, 'id')),
    }));
    return {
      ...omit(template, ['id', 'event', 'activeFrom']),
      questions,
    } satisfies TransformedSurveyTemplate;
  },
);

export const useFetchedTemplate = (
  prepareId: string,
  id?: EntityId,
): TransformedSurveyTemplate | undefined => {
  const dispatch = useAppDispatch();
  usePreparedEffect(
    `useFetchedTemplate-${prepareId}`,
    () => id && dispatch(fetchTemplate(id)),
    [id],
  );
  return useAppSelector((state: RootState) =>
    selectSurveyTemplateById(state, id),
  );
};

type FetchSurveyResult<ST = UnknownSurvey> = {
  survey: ST | undefined;
  event: EventForSurvey | undefined;
};
export function useFetchedSurvey(
  prepareId: string,
  surveyId: EntityId,
  token: string,
): FetchSurveyResult<PublicResultsSurvey>;
export function useFetchedSurvey(
  prepareId: string,
  surveyId: EntityId,
): FetchSurveyResult<DetailedSurvey>;
export function useFetchedSurvey(
  prepareId: string,
  surveyId: EntityId,
  token?: string,
) {
  const dispatch = useAppDispatch();
  usePreparedEffect(
    `useFetchedSurvey-${prepareId}`,
    () =>
      token
        ? dispatch(fetchWithToken(surveyId, token))
        : dispatch(fetchSurvey(surveyId)),
    [surveyId],
  );
  const survey = useAppSelector((state: RootState) =>
    selectSurveyById(state, surveyId),
  ) as UnknownSurvey | undefined;
  const event = useAppSelector((state: RootState) =>
    selectEventById<EventForSurvey>(state, survey?.event),
  );

  return {
    survey,
    event,
  };
}
