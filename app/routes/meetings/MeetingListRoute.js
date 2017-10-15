// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchAll } from 'app/actions/MeetingActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectMeetings } from 'app/reducers/meetings';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import MeetingList from './components/MeetingList';

const mapStateToProps = (state, props) => ({
  meetings: selectMeetings(state),
  user: props.currentUser
});

const mapDispatchToProps = { fetchAll };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingList);
