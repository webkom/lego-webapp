import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchEvent } from 'app/actions/EventActions';
import EventDetail from './components/EventDetail';
import { selectEventById, selectCommentsForEvent } from 'app/reducers/events';

function loadData({ eventId }, props) {
  props.fetchEvent(Number(eventId));
}

function mapStateToProps(state, props) {
  const { eventId } = props.params;
  const event = selectEventById(state, { eventId });
  const comments = selectCommentsForEvent(state, { eventId });

  return {
    comments,
    event,
    eventId
  };
}

const mapDispatchToProps = { fetchEvent };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['eventId', 'loggedIn'], loadData),
)(EventDetail);
