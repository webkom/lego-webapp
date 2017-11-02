import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import {
  fetchAdministrate,
  adminRegister,
  unregister,
  updatePresence,
  updatePayment
} from 'app/actions/EventActions';
import EventAdministrate from './components/EventAdministrate';
import {
  selectEventById,
  selectPoolsForEvent,
  getRegistrationGroups
} from 'app/reducers/events';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const eventId = props.params.eventId;

  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const pools = selectPoolsForEvent(state, { eventId });
  const { registered, unregistered } = getRegistrationGroups(state, {
    eventId
  });

  return {
    eventId,
    actionGrant,
    event,
    pools,
    registered,
    unregistered
  };
};

const mapDispatchToProps = {
  unregister,
  adminRegister,
  updatePresence,
  updatePayment
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    ({ params: { eventId } }, dispatch) =>
      dispatch(fetchAdministrate(Number(eventId))),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(EventAdministrate);
