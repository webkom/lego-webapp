// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/MeetingActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectMeetings } from 'app/reducers/meetings';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import MeetingList from './components/MeetingList';
import { selectHasMore } from '../../reducers/selectors';
import moment from 'moment';

const mapStateToProps = (state, props) => ({
  meetings: selectMeetings(state),
  currentUser: props.currentUser,
  loading: state.meetings.fetching,
  hasMore: selectHasMore('meetings')(state)
});

const mapDispatchToProps = {
  fetchAll,
  loadMore: () =>
    fetchAll({
      dateAfter: moment()
        .subtract(3, 'weeks')
        .format('YYYY-MM-DD'),
      refresh: true,
      loadNextPage: true
    }),
  loadOlder: () =>
    fetchAll({
      dateBefore: moment()
        .subtract(3, 'weeks')
        .format('YYYY-MM-DD'),
      ordering: '-start_time',
      refresh: true,
      loadNextPage: true
    })
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingList);
