import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
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
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const eventId = props.params.eventId;
  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = selectRegistrationsFromPools(state, { eventId });
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  const valueSelector = formValueSelector('eventEditor');
  return {
    initialValues: {
      ...event,
      pools: pools.map(pool => ({
        ...pool,
        permissionGroups: (pool.permissionGroups || [])
          .map(group => ({ label: group.name, value: group.id }))
      })),
      company: event.company && {
        label: event.company.name,
        value: event.company.id
      }
    },
    actionGrant,
    event: {
      ...event,
      isPriced: valueSelector(state, 'isPriced'),
      eventType: valueSelector(state, 'eventType')
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
  handleSubmitCallback: editEvent,
  uploadFile,
  setCoverPhoto
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    ({ params: { eventId } }, dispatch) => dispatch(fetchEvent(eventId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(EventEditor);
