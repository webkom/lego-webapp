import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { formValueSelector } from 'redux-form';
import {
  fetchEvent,
  editEvent,
  deleteEvent,
  setCoverPhoto
} from 'app/actions/EventActions';
import { uploadFile } from 'app/actions/FileActions';
import EventEditor from './components/EventEditor';
import {
  selectEventById,
  selectPoolsWithRegistrationsForEvent,
  selectRegistrationsFromPools,
  selectWaitingRegistrationsForEvent
} from 'app/reducers/events';
import { LoginPage } from 'app/components/LoginForm';
import { transformEvent } from './utils';
import time from 'app/utils/time';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import moment from 'moment-timezone';

const mapStateToProps = (state, props) => {
  const eventId = props.match.params.eventId;
  const event = selectEventById(state, { eventId });
  const actionGrant = event.actionGrant || [];
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = selectRegistrationsFromPools(state, { eventId });
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  const valueSelector = formValueSelector('eventEditor');
  return {
    initialValues: {
      ...event,
      mergeTime: event.mergeTime ? event.mergeTime : time({ hours: 12 }),
      priceMember: event.priceMember / 100,
      pools: pools.map(pool => ({
        ...pool,
        permissionGroups: (pool.permissionGroups || []).map(group => ({
          label: group.name,
          value: group.id
        }))
      })),
      company: event.company && {
        label: event.company.name,
        value: event.company.id
      },
      responsibleGroup: event.responsibleGroup && {
        label: event.responsibleGroup.name,
        value: event.responsibleGroup.id
      }
    },
    actionGrant,
    event: {
      ...event,
      addFee: valueSelector(state, 'addFee'),
      isPriced: valueSelector(state, 'isPriced'),
      eventType: valueSelector(state, 'eventType'),
      eventStatusType: valueSelector(state, 'eventStatusType'),
      heedPenalties: valueSelector(state, 'heedPenalties'),
      feedbackRequired: valueSelector(state, 'feedbackRequired'),
      useStripe: valueSelector(state, 'useStripe'),
      priceMember: valueSelector(state, 'priceMember'),
      registrationDeadline:
        valueSelector(state, 'startTime') &&
        moment(valueSelector(state, 'startTime')).subtract(
          valueSelector(state, 'registrationDeadlineHours'),
          'hours'
        )
    },
    eventId,
    pools: valueSelector(state, 'pools'),
    registrations,
    waitingRegistrations
  };
};

const mapDispatchToProps = {
  fetchEvent,
  deleteEvent,
  handleSubmitCallback: event => editEvent(transformEvent(event, true)),
  uploadFile,
  setCoverPhoto
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ match: { params: { eventId } } }, dispatch) =>
    dispatch(fetchEvent(eventId))
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  replaceUnlessLoggedIn(LoginPage)
  //loadingIndicator(['event.title'])
)(EventEditor);
