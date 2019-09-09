import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchSurvey,
  shareSurvey,
  hideSurvey
} from 'app/actions/SurveyActions';
import SurveyDetail from './components/SurveyDetail';
import { compose } from 'redux';
import { selectSurveyById } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import loadingIndicator from 'app/utils/loadingIndicator';
import { push } from 'react-router-redux';

const loadData = ({ params: { surveyId } }, dispatch) =>
  dispatch(fetchSurvey(surveyId));

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  return {
    survey,
    surveyId,
    actionGrant: survey.actionGrant
  };
};

const mapDispatchToProps = {
  push,
  shareSurvey,
  hideSurvey
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.surveyId']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['survey.questions', 'survey.event'])
)(SurveyDetail);
