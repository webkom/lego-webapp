import moment from 'moment-timezone';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import {
  editSurvey,
  fetchSurvey,
  fetchTemplate,
} from 'app/actions/SurveyActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveyById, selectSurveyTemplate } from 'app/reducers/surveys';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import SurveyEditor from './components/SurveyEditor/SurveyEditor';
import { mappings } from './utils';

const mapStateToProps = (state, props) => {
  const notFetching = !state.surveys.fetching;
  const surveyId = Number(props.match.params.surveyId);
  const survey = selectSurveyById(state, {
    surveyId,
  });
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
        activeFrom: moment(survey.event?.endTime),
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
              question.options &&
              question.options.concat({
                optionText: '',
              }),
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
  return {
    survey: surveyToSend,
    surveyId,
    fetching: state.surveys.fetching,
    template,
    initialValues,
    notFetching,
  };
};

const mapDispatchToProps = {
  submitFunction: editSurvey,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyEditor);
