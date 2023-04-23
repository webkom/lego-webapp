import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveys } from 'app/reducers/surveys';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import { fetchAll } from '../../actions/SurveyActions';
import SurveyPage from './components/SurveyList/SurveyPage';

const mapStateToProps = (state) => ({
  surveys: selectSurveys(state).filter((survey) => !survey.templateType),
  fetching: state.surveys.fetching,
  hasMore: state.surveys.hasMore,
});

const mapDispatchToProps = {
  fetchAll,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchSurvey', (props, dispatch) =>
    dispatch(fetchAll())
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyPage);
