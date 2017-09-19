// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { dispatched } from 'react-prepare';
import { fetchList } from 'app/actions/EventActions';
import EventList from './components/EventList';
import { selectEvents } from 'app/reducers/events';
import moment from 'moment';
import { selectHasMore } from '../../reducers/selectors';

const mapStateToProps = (state, ownProps) => {
  const icalToken =
    state.auth && state.users.byId[state.auth.username]
      ? state.users.byId[state.auth.username].icalToken
      : null;
  const actionGrant = state => state.events.actionGrant;
  return {
    ...createStructuredSelector({
      hasMore: selectHasMore('events'),
      events: selectEvents,
      actionGrant
    })(state, ownProps),
    icalToken
  };
};

const fetchData = ({ refresh, loadNextPage } = {}) =>
  fetchList({
    refresh,
    loadNextPage,
    dateAfter: moment().format('YYYY-MM-DD')
  });

const mapDispatchToProps = {
  fetchMore: () => fetchData({ refresh: true, loadNextPage: true }),
  reload: () => fetchData({ refresh: true })
};

export default compose(
  dispatched((props, dispatch) => dispatch(fetchData())),
  connect(mapStateToProps, mapDispatchToProps)
)(EventList);
