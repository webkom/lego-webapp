import { connect } from 'react-redux';
import {
  unregister,
  updatePresence,
  updatePayment
} from 'app/actions/EventActions';
import Attendees from './components/EventAdministrate/Attendees';
import { getRegistrationGroups } from 'app/reducers/events';

const mapStateToProps = (state, props) => {
  const { eventId, event, actionGrant, loading } = props;
  const { registered, unregistered } = getRegistrationGroups(state, {
    eventId
  });
  return {
    eventId,
    actionGrant,
    loading,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Attendees);
