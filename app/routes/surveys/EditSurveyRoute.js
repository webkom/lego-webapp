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
  const notFetching = !state.surveys.fetching && !state.events.fetching;
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  const templateType = props.location.query.templateType;
  const template = selectSurveyTemplate(state, { ...props, templateType });

  let initialValues = null;
  if (notFetching) {
    if (template) {
      initialValues = {
        ...template,
        event: '',
        activeFrom: survey.event.endTime
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
  }

  const surveyToSend = template ? { questions: template.questions } : survey;

  return {
    surveyToSend,
    surveyId,
    fetching: state.surveys.fetching,
    templateType,
    initialValues,
    notFetching
  };
};

const mapDispatchToProps = {
  submitFunction: editSurvey,
  deleteSurvey,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.surveyId', 'location.query.templateType']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching', 'survey.questions', 'survey.event'])
)(SurveyEditor);
