// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { debounce } from 'lodash';
import { dispatched } from '@webkom/react-prepare';
import { search } from 'app/actions/SearchActions';
import SearchPage from 'app/components/Search/SearchPage';
import { selectResult } from 'app/reducers/search';
import { markUsernamePresent } from 'app/actions/EventActions';

// $FlowFixMe
import goodSound from '../../assets/good-sound.mp3';

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
    handleSelect: ({ username }) =>
      dispatch(markUsernamePresent(eventId, username)).then(
        () => {
          const sound = new window.Audio(goodSound);
          sound.play();
          return dispatch(push(url));
        },
        err => {
          const payload = err.payload.response.jsonData;
          if (payload.error_code === 'not_registered') {
            alert('Bruker er ikke påmeldt på eventet!');
          } else if (payload.error_code === 'already_present') {
            alert('Bruker er allerede meldt som tilstede.');
          } else {
            alert(`Det oppsto en uventet feil: ${JSON.stringify(payload)}`);
          }
        }
      ),
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
)(SearchPage);
