// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';
import { dispatched } from '@webkom/react-prepare';
import { push } from 'react-router-redux';
import UserSettings from './components/UserSettings';
import loadingIndicator from 'app/utils/loadingIndicator';
import { selectUserByUsername } from 'app/reducers/users';
import {
  fetchUser,
  updateUser,
  updatePicture,
  changePassword
} from 'app/actions/UserActions';

const loadData = ({ params: { username } }, dispatch) =>
  dispatch(fetchUser(username));

const mapStateToProps = (state, props) => {
  const { isMe, params } = props;
  const username = isMe ? state.auth.username : params.username;
  const user = selectUserByUsername(state, { username });
  return {
    user,
    isMe,
    initialValues: user
  };
};

const mapDispatchToProps = { updateUser, updatePicture, changePassword, push };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  dispatched(loadData, { componentWillReceiveProps: false }),
  loadingIndicator(['user'])
)(UserSettings);
