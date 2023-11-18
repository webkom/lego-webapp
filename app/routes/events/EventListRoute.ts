import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchList } from 'app/actions/EventActions';
import { selectSortedEvents } from 'app/reducers/events';
import { selectPaginationNext } from 'app/reducers/selectors';
import { EntityType } from 'app/store/models/entities';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EventList from './components/EventList';

const mapStateToProps = (state, ownProps) => {
  const query = {
    date_after: moment().format('YYYY-MM-DD'),
  };
  const { pagination } = selectPaginationNext({
    endpoint: '/events/',
    entity: EntityType.Events,
    query,
  })(state);
  const user = ownProps.currentUser;
  const icalToken = user ? user.icalToken : null;

  return {
    events: selectSortedEvents(state),
    showFetchMore: pagination?.hasMore,
    actionGrant: state.events.actionGrant,
    icalToken,
    fetching: state.events.fetching,
  };
};

const fetchData = ({
  next,
}: {
  next?: boolean;
} = {}) =>
  fetchList({
    next,
    dateAfter: moment(),
  });

const mapDispatchToProps = {
  fetchMore: () =>
    fetchData({
      next: true,
    }),
};
export default compose(
  withPreparedDispatch('fetchEventList', (props, dispatch) =>
    dispatch(fetchData())
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(EventList);
