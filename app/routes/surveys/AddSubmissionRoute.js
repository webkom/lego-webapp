import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { fetch, addSubmission } from '../../actions/SurveyActions';
import SubmissionEditor from './components/SubmissionEditor';
import { selectSurveyById } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });

  return {
    survey,
    surveyId,
    initialValues: {
      user: '',
      submitted: '',
      submitted_time: '',
      answers: ''
    }
  };
};

const mapDispatchToProps = { submitFunction: addSubmission };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ params: { surveyId } }, dispatch) => dispatch(fetch(surveyId)), [
    'params.surveyId'
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(SubmissionEditor);
