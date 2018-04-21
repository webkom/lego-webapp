import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchSubmissions,
  addSubmission,
  deleteSubmission
} from 'app/actions/SurveySubmissionActions';
import { fetch, deleteSurvey } from 'app/actions/SurveyActions';
import SubmissionPage from './components/Submissions/SubmissionPage';
import { compose } from 'redux';
import { selectSurveySubmissions } from 'app/reducers/surveySubmissions';
import { selectSurveyById } from 'app/reducers/surveys';
import { push } from 'react-router-redux';
import loadingIndicator from 'app/utils/loadingIndicator';

const loadData = (props, dispatch) => {
  const { surveyId } = props.params;
  const { token } = props.location.query;
  return Promise.all([
    dispatch(fetch(surveyId, token)),
    dispatch(fetchSubmissions(surveyId, token))
  ]);
};

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const locationStrings = props.location.pathname.split('/');
  const isIndividual =
    locationStrings[locationStrings.length - 1] === 'individual';
  const survey = selectSurveyById(state, { surveyId });
  return {
    survey,
    submissions: selectSurveySubmissions(state, { surveyId }),
    notFetching: !state.surveys.fetching && !state.surveySubmissions.fetching,
    actionGrant: survey.actionGrant,
    isIndividual
  };
};

const mapDispatchToProps = {
  addSubmission,
  deleteSubmission,
  deleteSurvey,
  push
};

export default compose(
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching', 'survey.event', 'survey.questions'])
)(SubmissionPage);
