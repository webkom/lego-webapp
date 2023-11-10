import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  fetchNotificationAlternatives,
  fetchNotificationSettings,
  updateNotificationSetting,
} from 'app/actions/NotificationSettingsActions';
import { updateUser } from 'app/actions/UserActions';
import {
  selectNotificationSettingsAlternatives,
  selectNotificationSettings,
} from 'app/reducers/notificationSettings';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import UserSettingsNotifications from './components/UserSettingsNotifications';

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
    ]),
  ),
  connect(mapStateToProps, mapDispatchToProps),
)(UserSettingsNotifications);
