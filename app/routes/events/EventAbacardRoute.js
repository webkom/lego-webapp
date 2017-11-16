// @flow
import { connect } from 'react-redux';
import { updatePresence } from 'app/actions/EventActions';
import Abacard from './components/EventAdministrate/Abacard';

const mapStateToProps = (state, { eventId, event, actionGrant, loading }) => ({
  eventId,
  actionGrant,
  loading,
  event
});

const mapDispatchToProps = {
  updatePresence
};

export default connect(mapStateToProps, mapDispatchToProps)(Abacard);
