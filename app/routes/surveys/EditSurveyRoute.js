import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { editSurvey, fetch, deleteSurvey } from '../../actions/SurveyActions';
import SurveyEditor from './components/SurveyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectSurveyById } from 'app/reducers/surveys';

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  const fetching = state.surveys.fetching;

  return {
    survey,
    surveyId,
    fetching,
    initialValues: survey
      ? {
          title: survey.title,
          active_from: survey.active_from,
          questions: survey.questions,
          submissions: survey.submissions,
          event: survey.event,
          template_type: survey.template_type
        }
      : null
  };
};

const mapDispatchToProps = {
  submitFunction: editSurvey,
  deleteSurvey
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ params: { surveyId } }, dispatch) => dispatch(fetch(surveyId)), [
    'params.surveyId'
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyEditor);
