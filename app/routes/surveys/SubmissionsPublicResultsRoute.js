import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchWithToken } from 'app/actions/SurveyActions';
import SubmissionPublicResults from './components/Submissions/SubmissionPublicResults';
import { compose } from 'redux';
import { selectSurveyById } from 'app/reducers/surveys';
import { push } from 'connected-react-router';
import loadingIndicator from 'app/utils/loadingIndicator';
import qs from 'qs';

const loadData = (props, dispatch) => {
  const { surveyId } = props.match.params;
  const { token } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true
  });
  return dispatch(fetchWithToken(surveyId, token));
};

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.match.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  return {
    survey,
    notFetching: !state.surveys.fetching && !state.surveySubmissions.fetching,
    actionGrant: survey.actionGrant,
    token: qs.parse(props.location.search, { ignoreQueryPrefix: true }).token
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
