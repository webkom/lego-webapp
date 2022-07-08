import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import { LoginPage } from 'app/components/LoginForm';
import { selectSurveys } from 'app/reducers/surveys';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { fetchAll } from '../../actions/SurveyActions';
import SurveyPage from './components/SurveyList/SurveyPage';

const loadData = (props, dispatch) => dispatch(fetchAll());

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
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyPage);
