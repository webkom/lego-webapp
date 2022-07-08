// @flow

import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { fetchList } from 'app/actions/EventActions';
import { selectSortedEvents } from 'app/reducers/events';
import createQueryString from 'app/utils/createQueryString';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import { selectPagination } from '../../reducers/selectors';
import EventList from './components/EventList';

const mapStateToProps = (state, ownProps) => {
  const dateAfter = moment().format('YYYY-MM-DD');
  const query = { date_after: dateAfter };
  const queryString = createQueryString(query);
  const showFetchMore = selectPagination('events', { queryString });

  const user = ownProps.currentUser;
  const icalToken = user ? user.icalToken : null;
  const actionGrant = (state) => state.events.actionGrant;
  return {
    ...createStructuredSelector({
      showFetchMore,
      events: selectSortedEvents,
      actionGrant,
    })(state, ownProps),
    icalToken,
    notLoading: !state.events.fetching,
  };
};

const fetchData = ({
  refresh,
  loadNextPage,
}: { refresh?: boolean, loadNextPage?: boolean } = {}) =>
  fetchList({
    refresh,
    loadNextPage,
    dateAfter: moment().format('YYYY-MM-DD'),
  });

const mapDispatchToProps = {
  fetchMore: () => fetchData({ refresh: false, loadNextPage: true }),
  reload: () => fetchData({ refresh: true }),
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchData())),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notLoading'])
)(EventList);
