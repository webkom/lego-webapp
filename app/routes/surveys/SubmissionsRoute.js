import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import {
  editSurvey,
  fetchSurvey,
  hideSurvey,
  shareSurvey,
} from 'app/actions/SurveyActions';
import {
  addSubmission,
  deleteSubmission,
  fetchSubmissions,
  hideAnswer,
  showAnswer,
} from 'app/actions/SurveySubmissionActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveyById } from 'app/reducers/surveys';
import { selectSurveySubmissions } from 'app/reducers/surveySubmissions';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import 'isomorphic-fetch';
import SubmissionPage from './components/Submissions/SubmissionPage';
import { getCsvUrl } from './utils';

const loadData = (props, dispatch) => {
  const { surveyId } = props.match.params;
  return Promise.all([
    dispatch(fetchSurvey(surveyId)),
    dispatch(fetchSubmissions(surveyId)),
  ]);
};

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.match.params.surveyId);
  const locationStrings = props.location.pathname.split('/');
  const isSummary =
    locationStrings[locationStrings.length - 1] === 'individual';
  const survey = selectSurveyById(state, { surveyId });
  return {
    survey,
    submissions: selectSurveySubmissions(state, { surveyId }),
    notFetching: !state.surveys.fetching && !state.surveySubmissions.fetching,
    actionGrant: survey.actionGrant,
    isSummary,
    exportSurvey: async (surveyId) => {
      const blob = await fetch(getCsvUrl(surveyId), {
        headers: { Authorization: `JWT ${state.auth.token}` },
      }).then((response) => response.blob());
      return {
        url: URL.createObjectURL(blob),
        filename: survey.title.replace(/ /g, '_') + '.csv',
      };
    },
  };
};

const mapDispatchToProps = {
  addSubmission,
  deleteSubmission,
  push,
  shareSurvey,
  hideSurvey,
  showAnswer,
  hideAnswer,
  editSurvey,
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching', 'survey.event', 'survey.questions'])
)(SubmissionPage);
