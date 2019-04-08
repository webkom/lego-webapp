import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchAll } from '../../actions/SurveyActions';
import SurveyPage from './components/SurveyList/SurveyPage';
import { compose } from 'redux';
import { selectSurveys } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'connected-react-router';

const loadData = (props, dispatch) => dispatch(fetchAll());

const mapStateToProps = (state, props) => ({
  surveys: selectSurveys(state, props).filter(survey => !survey.templateType),
  fetching: state.surveys.fetching,
  hasMore: state.surveys.hasMore
});

const mapDispatchToProps = {
  fetchAll,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SurveyPage);
