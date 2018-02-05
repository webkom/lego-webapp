import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { addSubmission } from '../../actions/SurveySubmissionActions';
import { fetch } from 'app/actions/SurveyActions';
import SubmissionEditor from './components/SubmissionEditor';
import { selectSurveyById } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import loadingIndicator from 'app/utils/loadingIndicator';

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });

  return {
    survey,
    surveyId,
    initialValues: {
      user: props.currentUser,
      answers: []
    }
  };
};

const mapDispatchToProps = { submitFunction: addSubmission };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ params: { surveyId } }, dispatch) => dispatch(fetch(surveyId)), [
    'params.surveyId'
  ]),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['survey.questions', 'survey.event.cover'])
)(SubmissionEditor);
