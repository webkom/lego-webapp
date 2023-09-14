import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { LoginPage } from 'app/components/LoginForm';
import { selectSurveyTemplates } from 'app/reducers/surveys';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import { addSurvey, fetchTemplates } from '../../actions/SurveyActions';
import SurveyPage from './components/SurveyList/SurveyPage';

const mapStateToProps = (state, props) => ({
  surveys: selectSurveyTemplates(state, props),
  fetching: state.surveys.fetching,
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
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyPage);
