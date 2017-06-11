import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  fetchEvent,
  editEvent,
  deleteEvent,
  setCoverPhoto
} from 'app/actions/EventActions';
import { uploadFile } from 'app/actions/FileActions';
import EventEditor from './components/EventEditor';
import {
  selectEventById,
  selectPoolsWithRegistrationsForEvent,
  selectRegistrationsFromPools,
  selectWaitingRegistrationsForEvent
} from 'app/reducers/events';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { debounce } from 'lodash';

const mapStateToProps = (state, props) => {
  const eventId = props.params.eventId;
  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = selectRegistrationsFromPools(state, { eventId });
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  const valueSelector = formValueSelector('eventEditor');
  return {
    initialValues: {
      ...event,
      pools: pools.map(pool => ({
        ...pool,
        permissionGroups: (pool.permissionGroups || [])
          .map(group => ({ label: group.name, value: group.id }))
      })),
      company: {}
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
        handleSubmitCallback: editEvent,
        uploadFile,
        setCoverPhoto
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
