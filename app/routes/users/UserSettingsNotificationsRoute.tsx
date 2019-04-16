

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';

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
import { updateUser } from 'app/actions/UserActions';

const loadData = (props, dispatch) => {
  return Promise.all([
    dispatch(fetchNotificationAlternatives()),
    dispatch(fetchNotificationSettings())
  ]);
};

const mapStateToProps = (state, { currentUser }) => {
  return {
    alternatives: selectNotificationSettingsAlternatives(state),
    settings: selectNotificationSettings(state),
    currentUser
  };
};

const mapDispatchToProps = { updateNotificationSetting, updateUser };

export default compose(
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UserSettingsNotifications);
