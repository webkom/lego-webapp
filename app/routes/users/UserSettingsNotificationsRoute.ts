import { compose } from 'redux';
import { connect } from 'react-redux';

import UserSettingsNotifications from './components/UserSettingsNotifications';
import {
  fetchNotificationAlternatives,
  fetchNotificationSettings,
  updateNotificationSetting,
} from 'app/actions/NotificationSettingsActions';
import {
  selectNotificationSettingsAlternatives,
  selectNotificationSettings,
} from 'app/store/slices/notificationSettingsSlice';
import { updateUser } from 'app/actions/UserActions';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, { currentUser }) => {
  return {
    alternatives: selectNotificationSettingsAlternatives(state),
    settings: selectNotificationSettings(state),
    currentUser,
  };
};

const mapDispatchToProps = {
  updateNotificationSetting,
  updateUser,
};
export default compose(
  withPreparedDispatch('fetchUserSettingsNotifications', (props, dispatch) =>
    Promise.all([
      dispatch(fetchNotificationAlternatives()),
      dispatch(fetchNotificationSettings()),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(UserSettingsNotifications);
