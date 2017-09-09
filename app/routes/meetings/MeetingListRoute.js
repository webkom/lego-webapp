// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchAll } from 'app/actions/MeetingActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectMeetings } from 'app/reducers/meetings';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import MeetingList from './components/MeetingList';

const mapStateToProps = state => ({
  meetings: selectMeetings(state),
  user: state.auth.username ? state.users.byId[state.auth.username] : {}
});

const mapDispatchToProps = { fetchAll };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingList);
