import { connect } from 'react-redux';
import { compose } from 'redux';
import { addSurvey, fetchTemplate } from '../../actions/SurveyActions';
import { formValueSelector } from 'redux-form';
import SurveyEditor, {
  initialQuestion,
} from './components/SurveyEditor/SurveyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'connected-react-router';

import { selectSurveyTemplate } from 'app/store/slices/surveysSlice';
import { fetchEvent } from 'app/actions/EventActions';
import { selectEventById } from 'app/store/slices/eventsSlice';
import { defaultActiveFrom } from './utils';
import loadingIndicator from 'app/utils/loadingIndicator';
import qs from 'qs';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const loadData = (props, dispatch) => {
  const { templateType, event } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });

  if (event) {
    return dispatch(fetchEvent(event)).then((result) =>
      dispatch(fetchTemplate(result.payload.entities.events[event].eventType))
    );
  }

  if (templateType) {
    return dispatch(fetchTemplate(templateType));
  }
};

const mapStateToProps = (state, props) => {
  const notFetching = !state.surveys.fetching && !state.events.fetching;
  const { templateType, event } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });
  const fullEvent = selectEventById(state, {
    eventId: event,
  });
  const selectedTemplateType = templateType || fullEvent.eventType;
  const template = selectSurveyTemplate(state, {
    ...props,
    templateType: templateType || fullEvent.eventType,
  });
  const initialEvent = event
    ? {
        value: fullEvent.id,
        label: fullEvent.title,
      }
    : '';
  const activeFrom = event ? fullEvent.endTime : defaultActiveFrom(12, 0);
  const title = event ? `Spørreundersøkelse for ${fullEvent.title}` : '';
  let initialValues = null;

  if (notFetching) {
    if (template) {
      initialValues = { ...template, title, event: initialEvent, activeFrom };
    } else {
      initialValues = {
        activeFrom,
        event: initialEvent,
        title,
        questions: [initialQuestion],
      };
    }
  }

  const formSelector = formValueSelector('surveyEditor');
  return {
    template,
    selectedTemplateType,
    initialValues,
    survey: {
      questions: template ? template.questions : [],
      event: event && fullEvent,
    },
    notFetching,
    activeFrom: formSelector(state, 'activeFrom') || defaultActiveFrom(12, 0),
  };
};

const mapDispatchToProps = {
  submitFunction: addSurvey,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchAddSurvey', loadData, (props) => [
    props.location.search,
  ]),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching'])
)(SurveyEditor);
