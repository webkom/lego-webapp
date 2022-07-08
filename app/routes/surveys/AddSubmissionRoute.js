// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchSurvey } from 'app/actions/SurveyActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveyById } from 'app/reducers/surveys';
import { selectSurveySubmissionForUser } from 'app/reducers/surveySubmissions';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import {
  addSubmission,
  fetchUserSubmission,
} from '../../actions/SurveySubmissionActions';
import SubmissionContainer from './components/SubmissionEditor/SubmissionContainer';

const loadData = (
  {
    match: {
      params: { surveyId },
    },
    currentUser,
  },
  dispatch
) =>
  Promise.all([
    dispatch(fetchSurvey(surveyId)),
    currentUser.id && dispatch(fetchUserSubmission(surveyId, currentUser.id)),
  ]);

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.match.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  const currentUser = props.currentUser;
  const submission = selectSurveySubmissionForUser(state, {
    surveyId,
    currentUser,
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
      answers: [],
    },
  };
};

const mapDispatchToProps = { submitFunction: addSubmission };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['match.params.surveyId', 'currentUser.id', 'notFetching']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['survey.questions', 'survey.event'])
)(SubmissionContainer);
