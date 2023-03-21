import { connect } from 'react-redux';
import { getRegistrationGroups } from 'app/reducers/events';
import Allergies from './components/EventAdministrate/Allergies';

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

export default connect(mapStateToProps)(Allergies);
