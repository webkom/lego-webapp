
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { debounce } from 'lodash';
import { dispatched } from '@webkom/react-prepare';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocompleteRedux as selectAutocomplete } from 'app/reducers/search';
import {
  markUsernamePresent,
  markUsernameConsent
} from 'app/actions/EventActions';
import Abacard from './components/EventAdministrate/Abacard';

import { getRegistrationGroups } from 'app/reducers/events';

const searchTypes = ['users.user'];

const loadData = (props, dispatch) => {
  const query = props.location.query.q;
  if (query) {
    dispatch(autocomplete(query, searchTypes));
  }
};

const mapStateToProps = (state, props) => {
  const query = props.location.query.q;
  const results = query ? selectAutocomplete(state) : [];

  const { eventId } = props;
  const { registered } = getRegistrationGroups(state, {
    eventId
  });
  return {
    location: props.location,
    searching: state.search.searching,
    results,
    registered
  };
};

const mapDispatchToProps = (dispatch, { eventId }) => {
  const url = `/events/${eventId}/administrate/abacard?q=`;
  return {
    clearSearch: () => dispatch(push(url)),
    markUsernamePresent: (...props) => dispatch(markUsernamePresent(...props)),
    markUsernameConsent: (...props) => dispatch(markUsernameConsent(...props)),
    onQueryChanged: debounce(query => {
      dispatch(push(url + query));
      if (query) {
        dispatch(autocomplete(query, searchTypes));
      }
    }, 300)
  };
};

export default compose(
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Abacard);
