import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchAdministrate } from 'app/actions/EventActions';
import EventAdministrateIndex from './components/EventAdministrate';
import { selectEventById } from 'app/reducers/events';

const mapStateToProps = (state, props) => {
  const eventId = props.match.params.eventId;

  const event = selectEventById(state, { eventId });
  return {
    actionGrant: state.events.actionGrant,
    loading: state.events.fetching,
    eventId,
    event
  };
};

export default compose(
  prepare(
    ({ match }, dispatch) =>
      dispatch(fetchAdministrate(Number(match.params.eventId))),
    []
  ),
  connect(mapStateToProps)
)(EventAdministrateIndex);
