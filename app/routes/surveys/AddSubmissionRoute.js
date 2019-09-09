// @flow

import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { addSubmission } from '../../actions/SurveySubmissionActions';
import { fetchSurvey } from 'app/actions/SurveyActions';
import { fetchUserSubmission } from 'app/actions/SurveySubmissionActions';
import SubmissionContainer from './components/SubmissionEditor/SubmissionContainer';
import { selectSurveyById } from 'app/reducers/surveys';
import { selectSurveySubmissionForUser } from 'app/reducers/surveySubmissions';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import loadingIndicator from 'app/utils/loadingIndicator';

const loadData = ({ params: { surveyId }, currentUser }, dispatch) =>
  Promise.all([
    dispatch(fetchSurvey(surveyId)),
    currentUser.id && dispatch(fetchUserSubmission(surveyId, currentUser.id))
  ]);

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  const currentUser = props.currentUser;
  const submission = selectSurveySubmissionForUser(state, {
    surveyId,
    currentUser
  });
  const notFetching = state.surveySubmissions.fetching;

  return {
    survey,
    surveyId,
    submission,
    currentUser,
    notFetching,
    actionGrant: survey.actionGrant,
    initialValues: {
      answers: []
    }
  };
};

const mapDispatchToProps = { submitFunction: addSubmission };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.surveyId', 'currentUser.id', 'notFetching']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['survey.questions', 'survey.event'])
)(SubmissionContainer);
