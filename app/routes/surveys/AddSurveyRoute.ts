import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { fetchEvent } from 'app/actions/EventActions';
import { addSurvey, fetchTemplate } from 'app/actions/SurveyActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectEventById } from 'app/reducers/events';
import { selectSurveyTemplate } from 'app/reducers/surveys';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import SurveyEditor from './components/SurveyEditor/SurveyEditor';

const mapStateToProps = (state, props) => {
  const notFetching = !state.surveys.fetching && !state.events.fetching;
  const { templateType, event } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });

  const fullEvent = selectEventById(state, {
    eventId: event,
  });

  const template = selectSurveyTemplate(state, {
    ...props,
    templateType: templateType || fullEvent?.eventType,
  });

  return {
    template,
    survey: {
      questions: template ? template.questions : [],
      event: event && fullEvent,
    },
    notFetching,
  };
};

const mapDispatchToProps = {
  submitFunction: addSurvey,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyEditor);
