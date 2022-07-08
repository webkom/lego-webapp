import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import {
  fetchSurvey,
  hideSurvey,
  shareSurvey,
} from 'app/actions/SurveyActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveyById } from 'app/reducers/surveys';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import SurveyDetail from './components/SurveyDetail';

const loadData = (
  {
    match: {
      params: { surveyId },
    },
  },
  dispatch
) => dispatch(fetchSurvey(surveyId));

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.match.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  return {
    survey,
    surveyId,
    actionGrant: survey.actionGrant,
  };
};

const mapDispatchToProps = {
  push,
  shareSurvey,
  hideSurvey,
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['match.params.surveyId']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['survey.questions', 'survey.event'])
)(SurveyDetail);
