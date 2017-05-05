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

const getRegistrationsFromPools = (pools = []) =>
  pools.reduce((users, pool) => [...users, ...pool.registrations], []);

const mapStateToProps = (state, props) => {
  const { params: { eventId } } = props;
  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = getRegistrationsFromPools(pools);
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  if (waitingRegistrations.length > 0) {
    pools.push({
      name: 'Venteliste',
      registrations: waitingRegistrations
    });
  }
  const valueSelector = formValueSelector('eventEditor');
  return {
    initialValues: {
      ...event,
      pools: pools.map(pool => ({
        ...pool,
        permissionGroups: (pool.permissionGroups || [])
          .map(group => ({ label: group.name, value: group.id }))
      })),
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
    pools: valueSelector(state, 'pools'),
    registrations,
    waitingRegistrations,
    searching: state.search.searching,
    autocompleteResult: selectAutocomplete(state)
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
    companyQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['companies.company'])),
      30
    ),
    groupQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['users.abakusgroup'])),
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
