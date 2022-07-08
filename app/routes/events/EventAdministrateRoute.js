import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchAdministrate } from 'app/actions/EventActions';
import {
  selectEventById,
  selectMergedPoolWithRegistrations,
  selectPoolsWithRegistrationsForEvent,
} from 'app/reducers/events';
import prepare from 'app/utils/prepare';
import EventAdministrateIndex from './components/EventAdministrate';

const mapStateToProps = (state, props) => {
  const eventId = props.match.params.eventId;

  const event = selectEventById(state, { eventId });

  const poolsWithRegistrations = event.isMerged
    ? selectMergedPoolWithRegistrations(state, { eventId })
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
  prepare(
    ({ match }, dispatch) =>
      dispatch(fetchAdministrate(Number(match.params.eventId))),
    []
  ),
  connect(mapStateToProps)
)(EventAdministrateIndex);
