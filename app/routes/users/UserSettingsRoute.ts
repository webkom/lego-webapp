import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchUser,
  updateUser,
  updatePicture,
  deleteUser,
  changePassword,
  removePicture,
} from 'app/actions/UserActions';
import { selectUserByUsername } from 'app/reducers/users';
import { isCurrentUser } from 'app/routes/users/utils';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import UserSettings from './components/UserSettings';
import type { RootState } from 'app/store/createRootReducer';
import type { RouteChildrenProps } from 'react-router';

type Params = { username: string };

const mapStateToProps = (
  state: RootState,
  props: RouteChildrenProps<Params>
) => {
  const {
    match: { params },
  } = props;
  const username = isCurrentUser(params.username, state.auth.username)
    ? state.auth.username
    : params.username;
  const user = selectUserByUsername(state, {
    username,
  });

  return {
    user,
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
