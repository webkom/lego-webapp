import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchSubmissions,
  addSubmission,
  deleteSubmission
} from 'app/actions/SurveySubmissionActions';
import { fetch, deleteSurvey } from 'app/actions/SurveyActions';
import SubmissionPage from './components/SubmissionsPage';
import { compose } from 'redux';
import { selectSurveySubmissions } from 'app/reducers/surveySubmissions';
import { selectSurveyById } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'react-router-redux';
import loadingIndicator from 'app/utils/loadingIndicator';

const loadData = (props, dispatch) => {
  const { surveyId } = props.params;
  return Promise.all([
    dispatch(fetch(surveyId)),
    dispatch(fetchSubmissions(surveyId))
  ]);
};

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  return {
    survey: selectSurveyById(state, { surveyId }),
    submissions: selectSurveySubmissions(state, { surveyId }),
    notFetching: !state.surveys.fetching,
    actionGrant: state.surveys.actionGrant
  };
};

const mapDispatchToProps = {
  addSubmission,
  deleteSubmission,
  deleteSurvey,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching'])
)(SubmissionPage);
