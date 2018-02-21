import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import {
  editSurvey,
  fetch,
  deleteSurvey,
  fetchTemplate
} from '../../actions/SurveyActions';
import SurveyEditor from './components/SurveyEditor/SurveyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectSurveyById, selectSurveyTemplate } from 'app/reducers/surveys';
import { push } from 'react-router-redux';
import loadingIndicator from 'app/utils/loadingIndicator';
import { defaultActiveFrom } from './utils';

const loadData = (props, dispatch) => {
  const { surveyId } = props.params;
  const template = props.location.query.template;
  if (template) {
    return Promise.all([
      dispatch(fetchTemplate(template)),
      dispatch(fetch(surveyId))
    ]);
  }
  return dispatch(fetch(surveyId));
};

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  const templateType = props.location.query.template;
  const template = selectSurveyTemplate(state, { ...props, templateType });

  let initialValues = null;
  if (templateType) {
    initialValues = {
      ...template,
      event: '',
      activeFrom: defaultActiveFrom(12, 0)
    };
  } else if (survey) {
    initialValues = {
      ...survey,
      event: survey.event && {
        value: survey.event.id,
        label: survey.event.title
      },
      questions:
        survey.questions &&
        survey.questions.map(
          question =>
            question.options
              ? {
                  ...question,
                  options: question.options.concat({ optionText: '' })
                }
              : question
        )
    };
  }

  const surveyToSend = templateType
    ? { questions: template.questions }
    : survey;

  return {
    surveyToSend,
    surveyId,
    fetching: state.surveys.fetching,
    templateType,
    initialValues
  };
};

const mapDispatchToProps = {
  submitFunction: editSurvey,
  deleteSurvey,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.surveyId', 'template']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['survey.questions', 'survey.event.cover'])
)(SurveyEditor);
