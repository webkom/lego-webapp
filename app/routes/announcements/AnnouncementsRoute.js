// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import AnnouncementsList from './components/AnnouncementsList';
import { fetchAll } from 'app/actions/AnnouncementsActions';

const mapStateToProps = (state, props) => {
  const announcements = state.announcements;
<<<<<<< HEAD
=======
  console.log('hei');
>>>>>>> b319fe7... Route to /announcements, fetch from backend
  return {
    announcements
  };
};

const mapDispatchToProps = { fetchAll };
<<<<<<< HEAD

=======
>>>>>>> b319fe7... Route to /announcements, fetch from backend
export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(AnnouncementsList);
