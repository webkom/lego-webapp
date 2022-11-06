import { connect } from 'react-redux';
import { fetchAll } from '../../actions/SurveyActions';
import SurveyPage from './components/SurveyList/SurveyPage';
import { compose } from 'redux';
import { selectSurveys } from 'app/store/slices/surveysSlice';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'connected-react-router';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => ({
  surveys: selectSurveys(state, props).filter((survey) => !survey.templateType),
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
