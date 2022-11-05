import { connect } from 'react-redux';
import { addSurvey, fetchTemplates } from '../../actions/SurveyActions';
import SurveyPage from './components/SurveyList/SurveyPage';
import { compose } from 'redux';
import { selectSurveyTemplates } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'connected-react-router';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => ({
  surveys: selectSurveyTemplates(state, props),
  notFetching: !state.surveys.fetching,
});

const mapDispatchToProps = {
  addSurvey,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchTemplates', (props, dispatch) =>
    dispatch(fetchTemplates())
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching'])
)(SurveyPage);
