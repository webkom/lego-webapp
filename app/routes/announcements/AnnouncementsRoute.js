// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAll,
  sendAnnouncement,
} from 'app/actions/AnnouncementsActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectAnnouncements } from 'app/reducers/announcements';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import AnnouncementsList from './components/AnnouncementsList';

const mapStateToProps = (state, props) => {
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
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(mapStateToProps, mapDispatchToProps)
)(AnnouncementsList);
