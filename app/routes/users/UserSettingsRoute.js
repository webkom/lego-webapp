// @flow

import { connect } from 'react-redux';
import UserSettings from './components/UserSettings';
import {
  updateUser,
  updatePicture,
  changePassword
} from 'app/actions/UserActions';

const mapStateToProps = (state, props) => {
  const user = props.currentUser;
  return {
    user,
    initialValues: user
  };
};

const mapDispatchToProps = { updateUser, updatePicture, changePassword };

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
