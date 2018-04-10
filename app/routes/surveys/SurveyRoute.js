import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchAll, fetchMine } from '../../actions/SurveyActions';
import SurveyPage from './components/SurveyList/SurveyPage';
import { compose } from 'redux';
import { selectSurveys } from 'app/reducers/surveys';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'react-router-redux';

const loadData = (props, dispatch) =>
  props.location.query.filter ? dispatch(fetchAll()) : dispatch(fetchMine());

const mapStateToProps = (state, props) => {
  const surveys = selectSurveys(state, props).filter(
    survey => !survey.templateType
  );
  const showAll = !!props.location.query.filter;
  return {
    surveys: showAll
      ? surveys
      : surveys.filter(survey => survey.createdBy === props.currentUser.id),
    fetching: state.surveys.fetching,
    hasMore: state.surveys.hasMore,
    filter: props.params.filter
  };
};

const mapDispatchToProps = {
  fetchAll,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['location.query.filter']),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyPage);
