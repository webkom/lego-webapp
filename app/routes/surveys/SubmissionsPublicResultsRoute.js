import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import qs from 'qs';
import { compose } from 'redux';

import { fetchWithToken } from 'app/actions/SurveyActions';
import { selectSurveyById } from 'app/reducers/surveys';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import SubmissionPublicResults from './components/Submissions/SubmissionPublicResults';

const loadData = (props, dispatch) => {
  const { surveyId } = props.match.params;
  const { token } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
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
    token: qs.parse(props.location.search, { ignoreQueryPrefix: true }).token,
  };
};

const mapDispatchToProps = {
  push,
};

export default compose(
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator([
    'notFetching',
    'survey.event',
    'survey.questions',
    'survey.results',
  ])
)(SubmissionPublicResults);
