// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';

import UserSettingsNotifications from './components/UserSettingsNotifications';
import {
  fetchNotificationAlternatives,
  fetchNotificationSettings,
  updateNotificationSetting
} from 'app/actions/NotificationSettingsActions';
import {
  selectNotificationSettingsAlternatives,
  selectNotificationSettings
} from 'app/reducers/notificationSettings';

const loadData = (props, dispatch) => {
  return Promise.all([
    dispatch(fetchNotificationAlternatives()),
    dispatch(fetchNotificationSettings())
  ]);
};

const mapStateToProps = state => {
  return {
    alternatives: selectNotificationSettingsAlternatives(state),
    settings: selectNotificationSettings(state)
  };
};

const mapDispatchToProps = { updateNotificationSetting };

export default compose(
  dispatched(loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(UserSettingsNotifications);
