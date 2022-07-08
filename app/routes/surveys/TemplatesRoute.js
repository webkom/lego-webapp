import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import { LoginPage } from 'app/components/LoginForm';
import { selectSurveyTemplates } from 'app/reducers/surveys';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { addSurvey, fetchTemplates } from '../../actions/SurveyActions';
import SurveyPage from './components/SurveyList/SurveyPage';

const loadData = (props, dispatch) => dispatch(fetchTemplates());

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
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching'])
)(SurveyPage);
