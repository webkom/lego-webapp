// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
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

const mapStateToProps = (state, props) => {
  const announcements = selectAnnouncements(state);
  const actionGrant = state.announcements.actionGrant;
  return {
    announcements,
    actionGrant
  };
};

const mapDispatchToProps = {
  sendAnnouncement,
  createAnnouncement,
  deleteAnnouncement
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(AnnouncementsList);
