import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAdministrate } from 'app/actions/EventActions';
import EventAdministrateIndex from './components/EventAdministrate';
import {
  selectEventById,
  selectPoolsWithRegistrationsForEvent,
  selectMergedPoolWithRegistrations,
} from 'app/store/slices/eventsSlice';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const eventId = props.match.params.eventId;
  const event = selectEventById(state, {
    eventId,
  });
  const poolsWithRegistrations = event.isMerged
    ? selectMergedPoolWithRegistrations(state, {
        eventId,
      })
    : selectPoolsWithRegistrationsForEvent(state, {
        eventId,
      });
  const pools = poolsWithRegistrations;
  return {
    actionGrant: state.events.actionGrant,
    loading: state.events.fetching,
    eventId,
    event,
    pools,
  };
};

export default compose(
  withPreparedDispatch('fetchAdministrate', ({ match }, dispatch) =>
    dispatch(fetchAdministrate(Number(match.params.eventId)))
  ),
  connect(mapStateToProps)
)(EventAdministrateIndex);
