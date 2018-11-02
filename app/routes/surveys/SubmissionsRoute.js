import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchSubmissions,
  addSubmission,
  deleteSubmission,
  hideAnswer,
  showAnswer
} from 'app/actions/SurveySubmissionActions';
import { fetch, shareSurvey, hideSurvey } from 'app/actions/SurveyActions';
import SubmissionPage from './components/Submissions/SubmissionPage';
import { compose } from 'redux';
import { selectSurveySubmissions } from 'app/reducers/surveySubmissions';
import { selectSurveyById } from 'app/reducers/surveys';
import { push } from 'react-router-redux';
import loadingIndicator from 'app/utils/loadingIndicator';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const loadData = (props, dispatch) => {
  const { surveyId } = props.params;
  return Promise.all([
    dispatch(fetch(surveyId)),
    dispatch(fetchSubmissions(surveyId))
  ]);
};

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const locationStrings = props.location.pathname.split('/');
  const isSummary =
    locationStrings[locationStrings.length - 1] === 'individual';
  const survey = selectSurveyById(state, { surveyId });
  return {
    survey,
    submissions: selectSurveySubmissions(state, { surveyId }),
    notFetching: !state.surveys.fetching && !state.surveySubmissions.fetching,
    actionGrant: survey.actionGrant,
    isSummary
  };
};

const mapDispatchToProps = {
  addSubmission,
  deleteSubmission,
  push,
  shareSurvey,
  hideSurvey,
  showAnswer,
  hideAnswer
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['notFetching', 'survey.event', 'survey.questions'])
)(SubmissionPage);
