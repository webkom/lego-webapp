// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  fetchNotificationAlternatives,
  fetchNotificationSettings,
  updateNotificationSetting,
} from 'app/actions/NotificationSettingsActions';
import { updateUser } from 'app/actions/UserActions';
import {
  selectNotificationSettings,
  selectNotificationSettingsAlternatives,
} from 'app/reducers/notificationSettings';
import prepare from 'app/utils/prepare';
import UserSettingsNotifications from './components/UserSettingsNotifications';

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
