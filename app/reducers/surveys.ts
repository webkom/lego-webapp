import { createSlice } from '@reduxjs/toolkit';
import { usePreparedEffect } from '@webkom/react-prepare';
import { omit } from 'lodash';
import { createSelector } from 'reselect';
import {
  fetchSurvey,
  fetchTemplate,
  fetchWithToken,
} from 'app/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Survey } from '../actions/ActionTypes';
import { selectEventById } from './events';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { EventForSurvey } from 'app/store/models/Event';
import type {
  DetailedSurvey,
  PublicResultsSurvey,
  UnknownSurvey,
} from 'app/store/models/Survey';
import type {
  SurveyQuestion,
  SurveyQuestionOption,
} from 'app/store/models/SurveyQuestion';
import type { Overwrite } from 'utility-types';

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
