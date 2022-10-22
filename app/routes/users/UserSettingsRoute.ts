import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import UserSettings from './components/UserSettings';
import loadingIndicator from 'app/utils/loadingIndicator';
import { selectUserByUsername } from 'app/reducers/users';
import {
  fetchUser,
  updateUser,
  updatePicture,
  deleteUser,
  changePassword,
  removePicture,
} from 'app/actions/UserActions';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const {
    isMe,
    match: { params },
  } = props;
  const username = isMe ? state.auth.username : params.username;
  const user = selectUserByUsername(state, {
    username,
  });
  return {
    user,
    isMe,
    initialValues: {
      ...user,
      isAbakusMember: user && user.isAbakusMember.toString(),
    },
  };
};

const mapDispatchToProps = {
  updateUser,
  updatePicture,
  deleteUser,
  changePassword,
  push,
  removePicture,
};
export default compose(
  withPreparedDispatch('fetchUserSettings', (props, dispatch) =>
    dispatch(fetchUser(props.match.params.username))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['user'])
)(UserSettings);
