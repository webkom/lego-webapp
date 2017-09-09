// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import AnnouncementsList from './components/AnnouncementsList';
import { fetchAll, createAnnouncement } from 'app/actions/AnnouncementsActions';

const mapStateToProps = (state, props) => {
  const announcements = state.announcements.byId;
  console.log('hei', announcements);
  const actionGrant = state.announcements.actionGrant;
  return {
    announcements,
    actionGrant,
    initialValues: {
      message: '<p></p>'
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAll,
    submitAnnouncement: announcement =>
      dispatch(createAnnouncement(announcement))
  };
};

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(AnnouncementsList);
