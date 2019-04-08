import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchWithToken } from 'app/actions/SurveyActions';
import SubmissionPublicResults from './components/Submissions/SubmissionPublicResults';
import { compose } from 'redux';
import { selectSurveyById } from 'app/reducers/surveys';
import { push } from 'connected-react-router';
import loadingIndicator from 'app/utils/loadingIndicator';

const loadData = (props, dispatch) => {
  const { surveyId } = props.params;
  const { token } = props.location.query;
  return dispatch(fetchWithToken(surveyId, token));
};

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  return {
    survey,
    notFetching: !state.surveys.fetching && !state.surveySubmissions.fetching,
    actionGrant: survey.actionGrant,
    token: props.location.query.token
  };
};

const mapDispatchToProps = {
  push
};

export default compose(
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator([
    'notFetching',
    'survey.event',
    'survey.questions',
    'survey.results'
  ])
)(SubmissionPublicResults);
