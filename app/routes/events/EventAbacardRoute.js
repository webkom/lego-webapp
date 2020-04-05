// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { debounce } from 'lodash';
import prepare from 'app/utils/prepare';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocompleteRedux as selectAutocomplete } from 'app/reducers/search';
import {
  markUsernamePresent,
  markUsernameConsent
} from 'app/actions/EventActions';
import Abacard from './components/EventAdministrate/Abacard';
import qs from 'qs';

import { getRegistrationGroups } from 'app/reducers/events';

const searchTypes = ['users.user'];

const loadData = async (props, dispatch) => {
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true }).q;
  if (query) {
    await dispatch(autocomplete(query, searchTypes));
  }
};

const mapStateToProps = (state, props) => {
  const query = qs.parse(props.location.search);
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
    }, 100)
  };
};

export default compose(
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Abacard);
