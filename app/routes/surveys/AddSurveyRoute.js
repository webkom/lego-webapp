import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  addSurvey,
  deleteSurvey,
  fetchTemplate
} from '../../actions/SurveyActions';
import SurveyEditor from './components/SurveyEditor/SurveyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'react-router-redux';
import { initialQuestion } from './components/SurveyEditor/SurveyEditor';
import prepare from 'app/utils/prepare';
import { selectSurveyTemplate } from 'app/reducers/surveys';
import { fetchEvent } from 'app/actions/EventActions';
import { selectEventById } from 'app/reducers/events';
import { defaultActiveFrom } from './utils';

const loadData = (props, dispatch) => {
  const { template, event } = props.location.query;
  if (event) {
    return dispatch(fetchEvent(event)).then(
      result =>
        result.success &&
        dispatch(fetchTemplate(result.payload.entities.events[event].eventType))
    );
  }
  if (template) {
    return dispatch(fetchTemplate(template));
  }
};

const mapStateToProps = (state, props) => {
  const notFetching = !state.surveys.fetching && !state.events.fetching;
  const { templateType, event } = props.location.query;

  const fullEvent = selectEventById(state, { eventId: event });

  const template = selectSurveyTemplate(state, {
    ...props,
    templateType: templateType || fullEvent.eventType
  });

  const initialEvent = event
    ? {
        value: fullEvent.id,
        label: fullEvent.title
      }
    : '';
  const activeFrom = event ? fullEvent.endTime : defaultActiveFrom(12, 0);

  let initialValues = null;
  if (
    !(
      ((templateType || event) && !template) ||
      (event && Object.keys(fullEvent).length === 0)
    )
  ) {
    if (template) {
      initialValues = {
        ...template,
        event: initialEvent,
        activeFrom
      };
    } else {
      initialValues = {
        activeFrom,
        event: initialEvent,
        title: '',
        questions: [initialQuestion]
      };
    }
  }

  return {
    template,
    initialValues,
    survey: {
      questions: template ? template.questions : [],
      event: event && fullEvent
    },
    notFetching
  };
};

const mapDispatchToProps = {
  submitFunction: addSurvey,
  push,
  deleteSurvey
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, [
    'notFetching',
    'location.query.template',
    'location.query.event'
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyEditor);
