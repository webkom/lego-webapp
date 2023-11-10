import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchAll,
  createAnnouncement,
  sendAnnouncement,
  deleteAnnouncement,
} from 'app/actions/AnnouncementsActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectAnnouncements } from 'app/reducers/announcements';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import AnnouncementsList from './components/AnnouncementsList';
import type { RootState } from 'app/store/createRootReducer';

const mapStateToProps = (state: RootState) => {
  const announcements = selectAnnouncements(state);
  const actionGrant = state.announcements.actionGrant;
  return {
    announcements,
    actionGrant,
  };
};

const mapDispatchToProps = {
  createAnnouncement,
  sendAnnouncement,
  deleteAnnouncement,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchAnnouncements', (props, dispatch) =>
    dispatch(fetchAll()),
  ),
  connect(mapStateToProps, mapDispatchToProps),
)(AnnouncementsList);
