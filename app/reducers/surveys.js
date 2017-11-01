// @flow

import { Survey } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import mergeObjects from 'app/utils/mergeObjects';

export type SurveyEntity = {
  id?: number,
  title: string,
  event: any,
  activeFrom?: string,
  questions?: Array<QuestionEntity>,
  submissions?: Array<SubmmissionEntity>
};

export type SubmmissionEntity = {
  id?: number,
  user: number,
  survey: number,
  submitted?: boolean,
  submittedTime?: string,
  answers?: Array<AnswerEntity>
};

export type QuestionEntity = {
  id?: number,
  questionType: string,
  questionText: string,
  mandatory?: boolean,
  alternatives?: Array<AlternativeEntity>
};

export type AnswerEntity = {
  id?: number,
  user: number,
  survey: number,
  submitted?: boolean,
  submittedTime?: string,
  answers?: Array<AnswerEntity>
};

export type AlternativeEntity = {
  id?: number,
  alternativeText?: string,
  alternativeType: string
};

function mutateSurveys(state, action) {
  switch (action.type) {
    case Survey.DELETE.SUCCESS: {
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.id)
      };
    }

    case Survey.ADD_SUBMISSION.SUCCESS: {
      const companyId = action.meta.companyId;
      const semesterStatuses = state.byId[companyId].semesterStatuses.concat(
        action.payload
      );
      return mergeObjects(state, {
        byId: {
          [companyId]: { semesterStatuses }
        }
      });
    }

    case Survey.EDIT_SUBMISSION.SUCCESS: {
      const { companyId, semesterStatusId } = action.meta;
      const semesterStatuses = state.byId[companyId].semesterStatuses.map(
        status => (status.id === semesterStatusId ? action.payload : status)
      );
      return mergeObjects(state, {
        byId: {
          [companyId]: { semesterStatuses }
        }
      });
    }

    default:
      return state;
  }
}

export default createEntityReducer({
  key: 'surveys',
  types: {
    fetch: Survey.FETCH,
    mutate: Survey.ADD
  },
  mutate: mutateSurveys
});

export const selectSurveys = createSelector(
  state => state.surveys.items,
  state => state.surveys.byId,
  (surveyIds, surveysById) => {
    if (surveyIds.length === 0) return [];
    return surveyIds.map(surveyId => surveysById[surveyId]);
  }
);

export const selectSurveyById = createSelector(
  selectSurveys,
  (state, props) => props.surveyId,
  (surveys, surveyId) => {
    const survey = surveys.find(survey => survey.id === surveyId);
    return survey || {};
  }
);
