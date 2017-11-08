import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchAdministrate,
  unregister,
  updatePresence,
  updatePayment
} from 'app/actions/EventActions';
import Attendees from './components/EventAdministrate/Attendees';
import { selectEventById, getRegistrationGroups } from 'app/reducers/events';

const mapStateToProps = (state, props) => {
  const eventId = props.params.eventId;

  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const { registered, unregistered } = getRegistrationGroups(state, {
    eventId
  });
  return {
    eventId,
    actionGrant,
    loading: state.events.fetching,
    event,
    registered,
    unregistered
  };
};

const mapDispatchToProps = {
  unregister,
  updatePresence,
  updatePayment
};

export default compose(
  prepare(({ params: { eventId } }, dispatch) =>
    dispatch(fetchAdministrate(Number(eventId)))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Attendees);
