import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { createEvent, fetchEvent } from 'app/actions/EventActions';
import {
  fetchImageGallery,
  setSaveForUse,
  uploadFile,
} from 'app/actions/FileActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectCurrentUser } from 'app/reducers/auth';
import {
  selectEventById,
  selectPoolsWithRegistrationsForEvent,
} from 'app/reducers/events';
import { selectImageGalleryEntries } from 'app/reducers/imageGallery';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import time from 'app/utils/time';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EventEditor from './components/EventEditor';
import {
  transformEvent,
  transformEventStatusType,
  EVENT_CONSTANTS,
} from './utils';

const mapStateToProps = (state, props) => {
  const actionGrant = state.events.actionGrant;
  const valueSelector = formValueSelector('eventEditor');
  const eventId = props.location.state?.id;
  const eventTemplate = selectEventById(state, {
    eventId,
  });
  const poolsTemplate = selectPoolsWithRegistrationsForEvent(state, {
    eventId,
  });
  const imageGallery = selectImageGalleryEntries(state);
  const selectedValues = {
    event: {
      addFee: valueSelector(state, 'addFee'),
      isPriced: valueSelector(state, 'isPriced'),
      feedbackRequired: valueSelector(state, 'feedbackRequired'),
      heedPenalties: valueSelector(state, 'heedPenalties'),
      isGroupOnly: valueSelector(state, 'isGroupOnly'),
      useStripe: valueSelector(state, 'useStripe'),
      eventType: valueSelector(state, 'eventType'),
      priceMember: valueSelector(state, 'priceMember'),
      startTime: valueSelector(state, 'startTime'),
      separateDeadlines: valueSelector(state, 'separateDeadlines'),
      eventStatusType: valueSelector(state, 'eventStatusType'),
      registrationDeadline:
        valueSelector(state, 'startTime') &&
        moment(valueSelector(state, 'startTime')).subtract(
          valueSelector(state, 'registrationDeadlineHours'),
          'hours'
        ),
      unregistrationDeadline:
        valueSelector(state, 'startTime') &&
        moment(valueSelector(state, 'startTime')).subtract(
          valueSelector(state, 'unregistrationDeadlineHours'),
          'hours'
        ),
      useMazemap: valueSelector(state, 'useMazemap'),
      mazemapPoi: valueSelector(state, 'mazemapPoi'),
      hasFeedbackQuestion: valueSelector(state, 'hasFeedbackQuestion'),
    },
    pools: valueSelector(state, 'pools'),
  };

  const initialCreateValues = {
    initialValues: {
      title: '',
      startTime: time({
        hours: 17,
        minutes: 15,
      }),
      endTime: time({
        hours: 20,
        minutes: 15,
      }),
      description: '',
      text: '',
      eventType: '',
      eventStatusType: {
        value: 'TBA',
        label: 'Ikke bestemt (TBA)',
      },
      company: null,
      responsibleGroup: null,
      location: '',
      isPriced: false,
      useStripe: true,
      priceMember: 0,
      paymentDueDate: time({
        days: 7,
        hours: 17,
        minutes: 15,
      }),
      mergeTime: time({
        hours: 12,
      }),
      useCaptcha: true,
      heedPenalties: true,
      isGroupOnly: false,
      canViewGroups: [],
      useConsent: false,
      feedbackDescription: '',
      pools: [],
      useMazemap: true,
      separateDeadlines: false,
      unregistrationDeadline: time({
        hours: 12,
      }),
      registrationDeadlineHours: 2,
      unregistrationDeadlineHours: 2,
      responsibleUsers: [],
    },
    actionGrant,
    imageGallery: imageGallery.map((e) => {
      return {
        key: e.key,
        cover: e.cover,
        token: e.token,
        coverPlaceholder: e.coverPlaceholder,
      };
    }),
    ...selectedValues,
  };

  /* If there is no eventId in the params then we use the
   * normal initalValues for a new event
   */
  if (!eventId) return initialCreateValues;

  /* This will set the initalvalues as NULL if there is an
   * eventID but the template is empty. This means the template
   * is yet to be loaded. We return NULL to prevent the initial
   * values to be set to default
   */
  if (isEmpty(eventTemplate) && eventId) {
    return {
      initialValues: null,
      imageGallery: imageGallery.map((e) => {
        return { key: e.key, cover: e.cover, token: e.token };
      }),
    };
  }

  return {
    initialValues: {
      ...eventTemplate,
      mergeTime: eventTemplate.mergeTime
        ? eventTemplate.mergeTime
        : time({
            hours: 12,
          }),
      priceMember: eventTemplate.priceMember / 100,
      pools: poolsTemplate.map((pool) => ({
        activationDate: pool.activationDate,
        capacity: pool.capacity,
        name: pool.name,
        registrations: [],
        permissionGroups: (pool.permissionGroups || []).map((group) => ({
          label: group.name,
          value: group.id,
        })),
      })),
      company: eventTemplate.company && {
        label: eventTemplate.company.name,
        value: eventTemplate.company.id,
      },
      responsibleGroup: eventTemplate.responsibleGroup && {
        label: eventTemplate.responsibleGroup.name,
        value: eventTemplate.responsibleGroup.id,
      },

      eventType: eventTemplate.eventType && {
        label: EVENT_CONSTANTS[eventTemplate.eventType],
        value: eventTemplate.eventType,
      },
      eventStatusType:
        eventTemplate.eventStatusType &&
        transformEventStatusType(eventTemplate.eventStatusType),
    },
    actionGrant,
    imageGallery: imageGallery.map((e) => {
      return { key: e.key, cover: e.cover, token: e.token };
    }),
    ...selectedValues,
  };
};

const mapDispatchToProps = {
  handleSubmitCallback: (event) => createEvent(transformEvent(event)),
  fetchEvent,
  uploadFile,
  setSaveForUse,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchEventCreate', (props, dispatch) =>
    Promise.all([dispatch(fetchImageGallery())])
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['initialValues'])
)(EventEditor);
