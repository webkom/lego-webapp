import { omit } from 'lodash';
import { createSelector } from 'reselect';
import type { EventType } from 'app/models';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type { DetailedSurvey, UnknownSurvey } from 'app/store/models/Survey';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Survey } from '../actions/ActionTypes';
import { selectEvents } from './events';

export type OptionEntity = {
  id: number;
  optionText: string;
};
export type QuestionEntity = {
  id: number;
  questionType: string;
  questionText: string;
  displayType: string;
  mandatory?: boolean;
  options: Array<OptionEntity>;
  relativeIndex: number;
};
export type SurveyEntity = {
  id: number;
  title: string;
  event: any;
  activeFrom?: string;
  questions: Array<QuestionEntity>;
  templateType?: EventType;
  token?: string;
  results?: Record<string, any>;
  submissionCount?: number;
};

export default createEntityReducer<UnknownSurvey>({
  key: 'surveys',
  types: {
    fetch: Survey.FETCH,
    mutate: Survey.ADD,
  },
});
export const selectSurveys = createSelector(
  (state: RootState) => state.surveys.items,
  (state: RootState) => state.surveys.byId,
  selectEvents,
  (surveyIds, surveysById, events) => {
    return surveyIds.map((surveyId) => ({
      ...surveysById[surveyId],
      event: events.find((event) => event.id === surveysById[surveyId].event),
    }));
  }
);

type SurveyByIdProps = {
  surveyId: ID;
};

export const selectSurveyById = createSelector(
  (state: RootState) => selectSurveys(state),
  (state: RootState, props: SurveyByIdProps) => props.surveyId,
  (surveys, surveyId) => {
    const survey = surveys.find((survey) => survey.id === surveyId);
    return survey || {};
  }
);
export const selectSurveyTemplates = createSelector(
  (state: RootState) => selectSurveys(state),
  (surveys) => surveys.filter((survey) => survey.templateType)
);

type SurveyTemplateProps = {
  templateType: UnknownSurvey['templateType'];
};

export type SurveyTemplate = Omit<
  DetailedSurvey,
  'id' | 'event' | 'activeForm' | 'templateType'
> & {
  questions: (Omit<DetailedSurvey['questions'][number], 'id'> & {
    options: Omit<DetailedSurvey['questions'][number]['options'], 'id'>;
  })[];
};

export const selectSurveyTemplate = createSelector(
  (state: RootState) => selectSurveys(state),
  (_: RootState, props: SurveyTemplateProps) => props.templateType,
  (surveys, templateType) => {
    const template = surveys.find(
      (survey) => survey.templateType === templateType
    );
    if (!template) return undefined;
    const questions = (template.questions || []).map((question) => ({
      ...omit(question, 'id'),
      options: question.options.map((option) => omit(option, 'id')),
    }));
    return {
      ...omit(template, ['id', 'event', 'activeFrom', 'templateType']),
      questions,
    } as SurveyTemplate;
  }
);
