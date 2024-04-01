import { usePreparedEffect } from '@webkom/react-prepare';
import { omit } from 'lodash';
import { createSelector } from 'reselect';
import {
  fetchSurvey,
  fetchTemplate,
  fetchWithToken,
} from 'app/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Survey } from '../actions/ActionTypes';
import { selectEvents } from './events';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { EventForSurvey, EventType } from 'app/store/models/Event';
import type {
  DetailedSurvey,
  PublicResultsSurvey,
  UnknownSurvey,
} from 'app/store/models/Survey';
import type { Overwrite } from 'utility-types';

export default createEntityReducer<UnknownSurvey>({
  key: 'surveys',
  types: {
    fetch: Survey.FETCH,
    mutate: Survey.ADD,
  },
});

export type SelectedSurvey = Overwrite<
  DetailedSurvey,
  { event: EventForSurvey }
>;
export type SelectedPublicResultsSurvey = Overwrite<
  PublicResultsSurvey,
  { event: EventForSurvey }
>;
export const selectSurveys = createSelector(
  (state: RootState) => state.surveys.items,
  (state: RootState) => state.surveys.byId,
  selectEvents,
  (surveyIds, surveysById, events) => {
    return surveyIds.map(
      (surveyId) =>
        ({
          ...surveysById[surveyId],
          event: events.find(
            (event) => event.id === surveysById[surveyId].event,
          ),
        }) as unknown as SelectedSurvey,
    );
  },
);

export const selectSurveyById = createSelector(
  (state: RootState) => selectSurveys(state),
  (_: RootState, surveyId?: EntityId) => surveyId,
  (surveys, surveyId) => {
    return surveys.find((survey) => survey.id === Number(surveyId));
  },
);
export const selectSurveyTemplates = createSelector(
  (state: RootState) => selectSurveys(state),
  (surveys) => surveys.filter((survey) => survey.templateType),
);

type SurveyTemplateProps = {
  templateType: EventType;
};
export type SurveyTemplate = Omit<
  DetailedSurvey,
  'id' | 'event' | 'activeForm' | 'templateType'
> & {
  questions: (Omit<DetailedSurvey['questions'][number], 'id'> & {
    options: Omit<DetailedSurvey['questions'][number]['options'], 'id'>;
  })[];
  templateType: EventType;
};

export const selectSurveyTemplate = createSelector(
  (state: RootState) => selectSurveys(state),
  (_: RootState, props: SurveyTemplateProps) => props.templateType,
  (surveys, templateType) => {
    const template = surveys.find(
      (survey) => survey.templateType === templateType,
    );
    if (!template) return undefined;
    const questions = (template.questions || []).map((question) => ({
      ...omit(question, 'id'),
      options: question.options.map((option) => omit(option, 'id')),
    }));
    return {
      ...omit(template, ['id', 'event', 'activeFrom']),
      questions,
    } as SurveyTemplate;
  },
);

export const useFetchedTemplate = (
  prepareId: string,
  templateType?: EventType,
): SurveyTemplate | undefined => {
  const dispatch = useAppDispatch();
  usePreparedEffect(
    `useFetchedTemplate-${prepareId}`,
    () => templateType && dispatch(fetchTemplate(templateType)),
    [templateType],
  );
  return useAppSelector((state: RootState) =>
    templateType ? selectSurveyTemplate(state, { templateType }) : undefined,
  );
};

export function useFetchedSurvey(
  prepareId: string,
  surveyId?: EntityId,
  token?: string,
): SelectedPublicResultsSurvey | undefined;
export function useFetchedSurvey(
  prepareId: string,
  surveyId?: EntityId,
): SelectedSurvey | undefined;
export function useFetchedSurvey(
  prepareId: string,
  surveyId?: EntityId,
  token?: string,
) {
  const dispatch = useAppDispatch();
  usePreparedEffect(
    `useFetchedSurvey-${prepareId}`,
    () =>
      surveyId
        ? token
          ? dispatch(fetchWithToken(surveyId, token))
          : dispatch(fetchSurvey(surveyId))
        : Promise.resolve(),
    [surveyId],
  );
  return useAppSelector((state: RootState) =>
    selectSurveyById(state, surveyId),
  ) as SelectedSurvey | SelectedPublicResultsSurvey | undefined;
}
