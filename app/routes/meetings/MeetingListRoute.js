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

const mapStateToProps = (state, props) => ({
  meetings: selectMeetings(state),
  currentUser: props.currentUser,
  loading: state.meetings.fetching,
  hasMore: selectHasMore('meetings')(state)
});

const mapDispatchToProps = {
  fetchAll,
  loadMore: () => fetchAll(true)
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched((props, dispatch) => dispatch(fetchAll(false)), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingList);
