// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';

import UserSettingsNotifications from './components/UserSettingsNotifications';
import {
  fetchNotificationAlternatives,
  fetchNotificationSettings,
  updateNotificationSetting,
} from 'app/actions/NotificationSettingsActions';
import {
  selectNotificationSettingsAlternatives,
  selectNotificationSettings,
} from 'app/reducers/notificationSettings';
import { updateUser } from 'app/actions/UserActions';

const loadData = (props, dispatch) => {
  return Promise.all([
    dispatch(fetchNotificationAlternatives()),
    dispatch(fetchNotificationSettings()),
  ]);
};

const mapStateToProps = (state, { currentUser }) => {
  return {
    alternatives: selectNotificationSettingsAlternatives(state),
    settings: selectNotificationSettings(state),
    currentUser,
  };
};

const mapDispatchToProps = { updateNotificationSetting, updateUser };

export default compose(
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(UserSettingsNotifications);
