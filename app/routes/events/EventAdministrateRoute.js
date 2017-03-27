import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchRegistrationList, unregister } from 'app/actions/EventActions';
import EventAdministrate from './components/EventAdministrate';
import { selectAllRegistrationsForEvent } from 'app/reducers/events';
import { groupBy, sortBy } from 'lodash';

function mapStateToProps(state, props) {
  const {
    params: {
      eventId
    },
    currentUser
  } = props;

  const registrations = selectAllRegistrationsForEvent(state, { eventId });
  const grouped = groupBy(
    registrations,
    obj => obj.unregistrationDate.isValid() ? 'unregistered' : 'registered'
  );
  const registered = (grouped['registered'] || [])
    .sort((a, b) => a.registrationDate.isAfter(b.registrationDate));
  const unregistered = (grouped['unregistered'] || [])
    .sort((a, b) => a.unregistrationDate.isAfter(b.unregistrationDate));

  return {
    eventId,
    registered,
    unregistered
  };
}

const mapDispatchToProps = {
  unregister
};

export default compose(
  dispatched(
    ({ params: { eventId } }, dispatch) =>
      dispatch(fetchRegistrationList(Number(eventId))),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(EventAdministrate);
