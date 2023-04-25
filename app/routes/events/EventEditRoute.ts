import { push } from 'connected-react-router';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import {
  fetchEvent,
  editEvent,
  deleteEvent,
  setCoverPhoto,
} from 'app/actions/EventActions';
import {
  fetchImageGallery,
  setSaveForUse,
  uploadFile,
} from 'app/actions/FileActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectEventById,
  selectPoolsWithRegistrationsForEvent,
  selectRegistrationsFromPools,
  selectWaitingRegistrationsForEvent,
} from 'app/reducers/events';
import { selectImageGalleries } from 'app/reducers/imageGallery';
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
  const eventId = props.match.params.eventId;
  const event = selectEventById(state, {
    eventId,
  });
  const actionGrant = event.actionGrant || [];
  const pools = selectPoolsWithRegistrationsForEvent(state, {
    eventId,
  });
  const registrations = selectRegistrationsFromPools(state, {
    eventId,
  });
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId,
  });
  const valueSelector = formValueSelector('eventEditor');
  const imageGallery = selectImageGalleries(state);
  return {
    initialValues: {
      ...event,
      mergeTime: event.mergeTime
        ? event.mergeTime
        : time({
            hours: 12,
          }),
      priceMember: event.priceMember / 100,
      pools: pools.map((pool) => ({
        ...pool,
        permissionGroups: (pool.permissionGroups || []).map((group) => ({
          label: group.name,
          value: group.id,
        })),
      })),
      canViewGroups: (event.canViewGroups || []).map((group) => ({
        label: group.name,
        value: group.id,
        id: group.id,
      })),
      isGroupOnly: event.canViewGroups?.length > 0,
      company: event.company && {
        label: event.company.name,
        value: event.company.id,
      },
      responsibleGroup: event.responsibleGroup && {
        label: event.responsibleGroup.name,
        value: event.responsibleGroup.id,
      },
      eventType: event.eventType && {
        label: EVENT_CONSTANTS[event.eventType],
        value: event.eventType,
      },
      eventStatusType:
        event.eventStatusType &&
        transformEventStatusType(event.eventStatusType),
      mazemapPoi: event.mazemapPoi && {
        label: event.location,
        //if mazemapPoi has a value, location will be its displayname
        value: event.mazemapPoi,
      },
      separateDeadlines:
        event.registrationDeadlineHours !== event.unregistrationDeadlineHours,
      useMazemap: event.eventStatusType === 'TBA' || event.mazemapPoi > 0,
      hasFeedbackQuestion: !!event.feedbackDescription,
    },
    imageGallery: imageGallery.map((e) => {
      return { key: e.key, cover: e.cover, token: e.token };
    }),
    actionGrant,
    event: {
      ...event,
      addFee: valueSelector(state, 'addFee'),
      mazemapPoi: valueSelector(state, 'mazemapPoi'),
      isPriced: valueSelector(state, 'isPriced'),
      eventType: valueSelector(state, 'eventType'),
      eventStatusType: valueSelector(state, 'eventStatusType'),
      heedPenalties: valueSelector(state, 'heedPenalties'),
      isGroupOnly: valueSelector(state, 'isGroupOnly'),
      feedbackRequired: valueSelector(state, 'feedbackRequired'),
      useStripe: valueSelector(state, 'useStripe'),
      priceMember: valueSelector(state, 'priceMember'),
      separateDeadlines: valueSelector(state, 'separateDeadlines'),
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
      hasFeedbackQuestion: valueSelector(state, 'hasFeedbackQuestion'),
    },
    eventId,
    pools: valueSelector(state, 'pools'),
    registrations,
    waitingRegistrations,
  };
};

const mapDispatchToProps = {
  fetchEvent,
  deleteEvent,
  handleSubmitCallback: (event) => editEvent(transformEvent(event)),
  uploadFile,
  setCoverPhoto,
  setSaveForUse,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchEventEdit', (props, dispatch) =>
    Promise.all([
      dispatch(fetchEvent(props.match.params.eventId)),
      dispatch(fetchImageGallery()),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['event.title'])
)(EventEditor);
