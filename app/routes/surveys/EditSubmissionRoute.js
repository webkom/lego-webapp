import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import {
  fetch,
  editSubmission,
  deleteSurvey
} from '../../actions/SurveyActions';
import SubmissionEditor from './components/SubmissionEditor';
import { selectSurveyById, selectSubmissionById } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const submissionId = Number(props.params.submissionId);
  const survey = selectSurveyById(state, { surveyId });
  const submission = selectSubmissionById(state, {
    surveyId,
    submissionId
  });

  return {
    survey,
    surveyId,
    submission,
    initialValues: submission
      ? {
          user: submission.studentContact && {
            value: Number(submission.studentContact.id),
            label: submission.studentContact.fullName
          },
          submitted: submission.submitted,
          submitted_time: submission.submitted_time,
          answers: submission.answers
        }
      : null
  };
};

const mapDispatchToProps = {
  submitFunction: editSubmission,
  deleteSurvey
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ params: { surveyId } }, dispatch) => dispatch(fetch(surveyId)), [
    'params.surveyId',
    'params.submissionId'
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(SubmissionEditor);
