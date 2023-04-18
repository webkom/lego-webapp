import { push } from 'connected-react-router';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchEvent } from 'app/actions/EventActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectEventById } from 'app/reducers/events';
import { selectSurveyTemplate } from 'app/reducers/surveys';
import type { FormSurvey } from 'app/store/models/Survey';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

import { addSurvey, fetchTemplate } from '../../actions/SurveyActions';
import SurveyEditor, {
  initialQuestion,
} from './components/SurveyEditor/SurveyEditor';
import { defaultActiveFrom } from './utils';
import type { DeepPartial } from 'utility-types';

const loadData = (props, dispatch) => {
  const { templateType, event } = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });

  if (event && typeof event === 'string') {
    return dispatch(fetchEvent(event)).then((result) =>
      dispatch(fetchTemplate(result.payload.entities.events[event].eventType))
    );
  }

  if (templateType && typeof templateType === 'string') {
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

  const selectedTemplateType = templateType || fullEvent?.eventType;
  const template = selectSurveyTemplate(state, {
    ...props,
    templateType: templateType || fullEvent?.eventType,
  });
  const initialEvent = fullEvent
    ? {
        value: fullEvent.id,
        label: fullEvent.title,
      }
    : undefined;
  const activeFrom = fullEvent ? fullEvent.endTime : defaultActiveFrom(12, 0);
  const title = fullEvent ? `Spørreundersøkelse for ${fullEvent.title}` : '';
  let initialValues: DeepPartial<FormSurvey> | null = null;

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

  return {
    template,
    selectedTemplateType,
    initialValues,
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
  withPreparedDispatch('fetchAddSurvey', loadData, (props) => [
    props.location.search,
  ]),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notFetching'])
)(SurveyEditor);
