import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { fetchEvent, editEvent, deleteEvent } from 'app/actions/EventActions';
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
  const { params: { eventId } } = props;
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
  const valueSelector = formValueSelector('eventEditor');
  return {
    initialValues: {
      ...event,
      company: event.company
        ? {
            label: event.company.name,
            value: event.company.id
          }
        : {}
    },
    actionGrant,
    event: {
      ...event,
      isPriced: valueSelector(state, 'isPriced'),
      eventType: valueSelector(state, 'eventType')
    },
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
        deleteEvent,
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
