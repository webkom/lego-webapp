import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import {
  fetchSurvey,
  shareSurvey,
  hideSurvey,
} from 'app/actions/SurveyActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveyById } from 'app/reducers/surveys';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import SurveyDetail from './components/SurveyDetail';

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
