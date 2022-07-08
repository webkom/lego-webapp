import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import qs from 'qs';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';

import {
  editSurvey,
  fetchSurvey,
  fetchTemplate,
} from 'app/actions/SurveyActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveyById, selectSurveyTemplate } from 'app/reducers/surveys';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import SurveyEditor from './components/SurveyEditor/SurveyEditor';
import { mappings } from './utils';

const loadData = (props, dispatch) => {
  const { surveyId } = props.match.params;
  const { templateType } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });
  if (templateType) {
    return Promise.all([
      dispatch(fetchTemplate(templateType)),
      dispatch(fetchSurvey(surveyId)),
    ]);
  }
  return dispatch(fetchSurvey(surveyId));
};

const mapStateToProps = (state, props) => {
  const notFetching = !state.surveys.fetching;
  const surveyId = Number(props.match.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  const templateType = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  }).templateType;
  const template = selectSurveyTemplate(state, { ...props, templateType });

  const initialEvent = survey.event && {
    value: survey.event.id,
    label: survey.event.title,
  };

  let initialValues = null;
  if (notFetching && !(templateType && !template)) {
    if (template) {
      initialValues = {
        ...template,
        title: survey.title || template.title,
        event: initialEvent,
        activeFrom: survey.event && survey.event.endTime,
      };
    } else {
      initialValues = {
        ...survey,
        event: initialEvent,
        questions:
          survey.questions &&
          survey.questions.map((question) => ({
            ...question,
            options:
              question.options && question.options.concat({ optionText: '' }),
            questionType: mappings.find(
              ({ value }) => value === question.questionType
            ),
          })),
      };
    }
  }

  const surveyToSend = template
    ? { ...survey, questions: template.questions }
    : survey;

  const formSelector = formValueSelector('surveyEditor');

  return {
    survey: surveyToSend,
    surveyId,
    fetching: state.surveys.fetching,
    template,
    selectedTemplateType: templateType,
    initialValues,
    notFetching,
    activeFrom: formSelector(state, 'activeFrom'),
  };
};

const mapDispatchToProps = {
  submitFunction: editSurvey,
  push,
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['match.params.surveyId', 'location.search']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching'])
)(SurveyEditor);
