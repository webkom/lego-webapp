import { connect } from 'react-redux';
import {
  fetchSurvey,
  shareSurvey,
  hideSurvey,
} from 'app/actions/SurveyActions';
import SurveyDetail from './components/SurveyDetail';
import { compose } from 'redux';
import { selectSurveyById } from 'app/store/slices/surveysSlice';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import loadingIndicator from 'app/utils/loadingIndicator';
import { push } from 'connected-react-router';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.match.params.surveyId);
  const survey = selectSurveyById(state, {
    surveyId,
  });
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
  withPreparedDispatch(
    'fetchSurveyDetail',
    (props, dispatch) => dispatch(fetchSurvey(props.match.params.surveyId)),
    (props) => [props.match.params.surveyId]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['survey.questions', 'survey.event'])
)(SurveyDetail);
