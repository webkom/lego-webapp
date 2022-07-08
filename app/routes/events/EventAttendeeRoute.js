import { connect } from 'react-redux';

import {
  unregister,
  updatePayment,
  updatePresence,
} from 'app/actions/EventActions';
import { getRegistrationGroups } from 'app/reducers/events';
import Attendees from './components/EventAdministrate/Attendees';

const mapStateToProps = (state, props) => {
  const { eventId, event, actionGrant, loading } = props;
  const { registered, unregistered } = getRegistrationGroups(state, {
    eventId,
  });
  return {
    eventId,
    actionGrant,
    loading,
    event,
    registered,
    unregistered,
  };
};

const mapDispatchToProps = {
  unregister,
  updatePresence,
  updatePayment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Attendees);
