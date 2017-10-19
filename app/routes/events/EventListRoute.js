// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/EventActions';
import EventList from './components/EventList';
import { selectSortedEvents } from 'app/reducers/events';
import moment from 'moment';
import { selectHasMore } from '../../reducers/selectors';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.currentUser;
  const icalToken = user ? user.icalToken : null;
  const actionGrant = state => state.events.actionGrant;
  return {
    ...createStructuredSelector({
      hasMore: selectHasMore('events'),
      events: selectSortedEvents,
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
  dispatched((props, dispatch) => dispatch(fetchData()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(EventList);
