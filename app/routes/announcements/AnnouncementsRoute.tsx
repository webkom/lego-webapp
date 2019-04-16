

import { compose } from 'redux';
import { connect } from 'react-redux';
import AnnouncementsList from './components/AnnouncementsList';
import {
  fetchAll,
  createAnnouncement,
  sendAnnouncement,
  deleteAnnouncement
} from 'app/actions/AnnouncementsActions';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectAnnouncements } from 'app/reducers/announcements';
import prepare from 'app/utils/prepare';

const mapStateToProps = (state, props) => {
  const announcements = selectAnnouncements(state);
  const actionGrant = state.announcements.actionGrant;
  return {
    announcements,
    actionGrant
  };
};

const mapDispatchToProps = {
  createAnnouncement,
  sendAnnouncement,
  deleteAnnouncement
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AnnouncementsList);
