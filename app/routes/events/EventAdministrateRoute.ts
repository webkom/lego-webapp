import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAdministrate } from 'app/actions/EventActions';
import {
  selectEventById,
  selectPoolsWithRegistrationsForEvent,
  selectMergedPoolWithRegistrations,
} from 'app/reducers/events';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EventAdministrateIndex from './components/EventAdministrate';

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
    dispatch(fetchAdministrate(Number(match.params.eventId))),
  ),
  connect(mapStateToProps),
)(EventAdministrateIndex);
