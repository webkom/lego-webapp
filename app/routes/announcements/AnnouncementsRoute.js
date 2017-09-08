// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import AnnouncementsList from './components/AnnouncementsList';
import { fetchAll } from 'app/actions/AnnouncementsActions';

const mapStateToProps = (state, props) => {
  const announcements = state.announcements;
  return {
    announcements
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(AnnouncementsList);
