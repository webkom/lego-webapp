import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetchEvent,
  editEvent,
  register,
  unregister,
  payment,
  updateFeedback
} from 'app/actions/EventActions';
import EventEditor from './components/EventEditor';
import {
  selectEventById,
  selectPoolsWithRegistrationsForEvent,
  selectWaitingRegistrationsForEvent
} from 'app/reducers/events';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { debounce } from 'lodash';

function getRegistrationsFromPools(pools = []) {
  return pools.reduce((users, pool) => [...users, ...pool.registrations], []);
}

const mapStateToProps = (state, props) => {
  const {
    params: {
      eventId
    },
    currentUser
  } = props;
  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = getRegistrationsFromPools(pools);
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  const poolsWithWaitingRegistrations = waitingRegistrations.length > 0
    ? [
        ...pools,
        {
          name: 'Venteliste',
          registrations: waitingRegistrations
        }
      ]
    : pools;
  return {
    initialValues: event,
    actionGrant,
    event,
    eventId,
    pools,
    registrations,
    waitingRegistrations,
    poolsWithWaitingRegistrations,
    searching: state.search.searching,
    companyResult: selectAutocomplete(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      {
        fetchEvent,
        handleSubmitCallback: editEvent
      },
      dispatch
    ),
    onQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['companies.company'])),
      30
    )
  };
};

const loadData = ({ eventId }, props) => {
  props.fetchEvent(eventId);
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['eventId', 'loggedIn'], loadData)
)(EventEditor);
