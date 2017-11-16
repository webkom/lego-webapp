import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { compose } from 'redux';
import { editSurvey, fetch, deleteSurvey } from '../../actions/SurveyActions';
import SurveyEditor from './components/SurveyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectSurveyById } from 'app/reducers/surveys';
import { push } from 'react-router-redux';
import loadingIndicator from 'app/utils/loadingIndicator';

const mapStateToProps = (state, props) => {
  const surveyId = Number(props.params.surveyId);
  const survey = selectSurveyById(state, { surveyId });

  return {
    survey,
    surveyId,
    fetching: state.surveys.fetching,
    initialValues: survey
      ? {
          ...survey,
          event: survey.event && {
            value: survey.event.id,
            label: survey.event.title
          },
          isClone: String(survey.isClone)
        }
      : null
  };
};

const mapDispatchToProps = {
  submitFunction: editSurvey,
  deleteSurvey,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ params: { surveyId } }, dispatch) => dispatch(fetch(surveyId)), [
    'params.surveyId'
  ]),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['survey.title'])
)(SurveyEditor);
