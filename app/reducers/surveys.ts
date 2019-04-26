import { Survey } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { selectEvents } from './events';
import { omit } from 'lodash';

export default createEntityReducer({
  key: 'surveys',
  types: {
    fetch: Survey.FETCH,
    mutate: Survey.ADD
  }
});

export const selectSurveys = createSelector(
  state => state.surveys.items,
  state => state.surveys.byId,
  selectEvents,
  (surveyIds, surveysById, events) => {
    return surveyIds.map(surveyId => ({
      ...surveysById[surveyId],
      event: events.find(event => event.id === surveysById[surveyId].event)
    }));
  }
);

export const selectSurveyById = createSelector(
  (state, props) => selectSurveys(state, props),
  (state, props) => props.surveyId,
  (surveys, surveyId) => {
    const survey = surveys.find(survey => survey.id === surveyId);
    return survey || {};
  }
);

export const selectSurveyTemplates = createSelector(
  (state, props) => selectSurveys(state, props),
  surveys => surveys.filter(survey => survey.templateType)
);

export const selectSurveyTemplate = createSelector(
  (state, props) => selectSurveys(state, props),
  (state, props) => props.templateType,
  (surveys, templateType) => {
    const template = surveys.find(
      survey => survey.templateType === templateType
    );
    if (!template) return false;

    const questions = (template.questions || []).map(question => ({
      ...omit(question, 'id'),
      options: question.options.map(option => omit(option, 'id'))
    }));
    return {
      ...omit(template, ['id', 'event', 'activeFrom', 'templateType']),
      questions
    };
  }
);
