import 'isomorphic-fetch';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import {
  fetchSurvey,
  shareSurvey,
  hideSurvey,
  editSurvey,
} from 'app/actions/SurveyActions';
import {
  fetchSubmissions,
  addSubmission,
  deleteSubmission,
  hideAnswer,
  showAnswer,
} from 'app/actions/SurveySubmissionActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveySubmissions } from 'app/reducers/surveySubmissions';
import { selectSurveyById } from 'app/reducers/surveys';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import SubmissionPage from './components/Submissions/SubmissionPage';
import { getCsvUrl } from './utils';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type { RouteChildrenProps } from 'react-router';

const loadData = (props, dispatch) => {
  const { surveyId } = props.match.params;
  return Promise.all([
    dispatch(fetchSurvey(surveyId)),
    dispatch(fetchSubmissions(surveyId)),
  ]);
};

const mapStateToProps = (
  state: RootState,
  props: RouteChildrenProps<{ surveyId: string }>
) => {
  const surveyId = Number(props.match.params.surveyId);
  const locationStrings = props.location.pathname.split('/');
  const isSummary =
    locationStrings[locationStrings.length - 1] === 'individual';
  const survey = selectSurveyById(state, {
    surveyId,
  });
  return {
    survey,
    submissions: selectSurveySubmissions(state, {
      surveyId,
    }),
    notFetching: !state.surveys.fetching && !state.surveySubmissions.fetching,
    actionGrant: survey.actionGrant,
    isSummary,
    exportSurvey: async (surveyId: ID) => {
      const blob = await fetch(getCsvUrl(surveyId), {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
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
  withPreparedDispatch('fetchSubmissions', loadData),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching', 'survey.event', 'survey.questions'])
)(SubmissionPage);
