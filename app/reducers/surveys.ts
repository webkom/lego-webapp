import { omit } from 'lodash';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Survey } from '../actions/ActionTypes';
import { selectEvents } from './events';
import type { EventType } from 'app/models';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type { UnknownSurvey } from 'app/store/models/Survey';

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
  templateType: NonNullable<UnknownSurvey['templateType']>;
};

export const selectSurveyTemplate = createSelector(
  (state: RootState) => selectSurveys(state),
  (state, props: SurveyTemplateProps) => props.templateType,
  (surveys, templateType) => {
    const template = surveys.find(
      (survey) => survey.templateType === templateType
    );
    if (!template) return false;
    const questions = (template.questions || []).map((question) => ({
      ...omit(question, 'id'),
      options: question.options.map((option) => omit(option, 'id')),
    }));
    return {
      ...omit(template, ['id', 'event', 'activeFrom', 'templateType']),
      questions,
    };
  }
);
