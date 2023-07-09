import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchAll,
  createAnnouncement,
  sendAnnouncement,
  deleteAnnouncement,
} from 'app/actions/AnnouncementsActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectAllAnnouncements } from 'app/reducers/announcements';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import AnnouncementsList from './components/AnnouncementsList';

const mapStateToProps = (state, props) => {
  const announcements = selectAllAnnouncements(state);
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
    dispatch(fetchAll())
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(AnnouncementsList);
