// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';
import { dispatched } from 'react-prepare';
import UserSettings from './components/UserSettings';
import loadingIndicator from 'app/utils/loadingIndicator';
import {
  fetchUser,
  updateUser,
  updatePicture,
  changePassword
} from 'app/actions/UserActions';

const loadData = ({ params: { username } }, dispatch) =>
  dispatch(fetchUser(username));

const mapStateToProps = (state, props) => {
  const { params } = props;
  const isMe =
    params.username === 'me' || params.username === state.auth.username;
  const username = isMe ? state.auth.username : params.username;
  const user = state.users.byId[username];
  return {
    user,
    isMe,
    initialValues: user
  };
};

const mapDispatchToProps = { updateUser, updatePicture, changePassword };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  dispatched(loadData, { componentWillReceiveProps: false }),
  loadingIndicator('user')
)(UserSettings);
