import { debounce } from 'lodash';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'redux-first-history';
import { markUsernamePresent } from 'app/actions/EventActions';
import { autocomplete } from 'app/actions/SearchActions';
import { getRegistrationGroups } from 'app/reducers/events';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Abacard from './components/EventAdministrate/Abacard';

const searchTypes = ['users.user'];

const loadData = async (props, dispatch): Promise<void> => {
  const query = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  }).q;

  if (query && typeof query === 'string') {
    await dispatch(autocomplete(query, searchTypes));
  }
};

const mapStateToProps = (state, props) => {
  const { eventId } = props;
  const { registered } = getRegistrationGroups(state, {
    eventId,
  });
  return {
    registered,
  };
};

const mapDispatchToProps = (dispatch, { eventId }) => {
  const url = `/events/${eventId}/administrate/abacard?q=`;
  return {
    clearSearch: () => dispatch(replace(url)),
    markUsernamePresent: (eventId: number, username: string) =>
      dispatch(markUsernamePresent(eventId, username)),
    onQueryChanged: debounce((query) => {
      dispatch(replace(url + query));

      if (query) {
        dispatch(autocomplete(query, searchTypes));
      }
    }, 300),
  };
};

export default compose(
  withPreparedDispatch('fetchEventAbacard', loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(Abacard);
