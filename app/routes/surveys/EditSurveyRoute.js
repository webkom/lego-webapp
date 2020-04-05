import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import {
  editSurvey,
  fetchSurvey,
  fetchTemplate
} from 'app/actions/SurveyActions';
import SurveyEditor from './components/SurveyEditor/SurveyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectSurveyById, selectSurveyTemplate } from 'app/reducers/surveys';
import { push } from 'connected-react-router';
import loadingIndicator from 'app/utils/loadingIndicator';
import { formValueSelector } from 'redux-form';
import qs from 'qs';

const loadData = (props, dispatch) => {
  const { surveyId } = props.match.params;
  const { templateType } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true
  });
  if (templateType) {
    return Promise.all([
      dispatch(fetchTemplate(templateType)),
      dispatch(fetchSurvey(surveyId))
    ]);
  }
  return dispatch(fetchSurvey(surveyId));
};

const mapStateToProps = (state, props) => {
  const notFetching = !state.surveys.fetching;
  const surveyId = Number(props.match.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  const templateType = qs.parse(props.location.search, {
    ignoreQueryPrefix: true
  }).templateType;
  const template = selectSurveyTemplate(state, { ...props, templateType });

  const initialEvent = survey.event && {
    value: survey.event.id,
    label: survey.event.title
  };

  let initialValues = null;
  if (notFetching && !(templateType && !template)) {
    if (template) {
      initialValues = {
        ...template,
        title: survey.title || template.title,
        event: initialEvent,
        activeFrom: survey.event && survey.event.endTime
      };
    } else {
      initialValues = {
        ...survey,
        event: initialEvent,
        questions:
          survey.questions &&
          survey.questions.map(question =>
            question.options
              ? {
                  ...question,
                  options: question.options.concat({ optionText: '' })
                }
              : question
          )
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
    activeFrom: formSelector(state, 'activeFrom')
  };
};

const mapDispatchToProps = {
  submitFunction: editSurvey,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.surveyId', 'location.query.templateType']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['notFetching'])
)(SurveyEditor);
