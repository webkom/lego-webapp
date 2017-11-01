import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetch, addSurvey, editSurvey } from 'app/actions/SurveyActions';
import SurveyDetail from './components/SurveyDetail';
import { compose } from 'redux';
import { selectSurveyById } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const loadData = ({ params: { surveyId } }, dispatch) =>
  dispatch(fetch(surveyId));

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });
  const fetching = state.surveys.fetching;
  return {
    survey,
    surveyId,
    fetching
  };
};

const mapDispatchToProps = {
  addSurvey,
  editSurvey
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.surveyId']),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyDetail);
