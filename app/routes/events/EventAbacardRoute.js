// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { debounce } from 'lodash';
import { dispatched } from '@webkom/react-prepare';
import { search } from 'app/actions/SearchActions';
import { selectResult } from 'app/reducers/search';
import { markUsernamePresent } from 'app/actions/EventActions';
import Abacard from './components/EventAdministrate/Abacard';

const searchTypes = ['users.user'];

const loadData = (props, dispatch) => {
  const query = props.location.query.q;
  if (query) {
    dispatch(search(query, searchTypes));
  }
};

const mapStateToProps = (state, props) => {
  const query = props.location.query.q;
  const results = query ? selectResult(state) : [];
  return {
    location: props.location,
    searching: state.search.searching,
    results
  };
};

const mapDispatchToProps = (dispatch, { eventId }) => {
  const url = `/events/${eventId}/administrate/abacard?q=`;
  return {
    clearSearch: () => dispatch(push(url)),
    handleSelect: ({ username }) =>
      dispatch(markUsernamePresent(eventId, username)),
    onQueryChanged: debounce(query => {
      dispatch(push(url + query));
      if (query) {
        dispatch(search(query, searchTypes));
      }
    }, 300)
  };
};

export default compose(
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Abacard);
