// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchAdministrate, adminRegister } from 'app/actions/EventActions';
import AdminRegister from './components/EventAdministrate/AdminRegister';
import { selectEventById, selectPoolsForEvent } from 'app/reducers/events';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const eventId = props.params.eventId;

  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const pools = selectPoolsForEvent(state, { eventId });
  return {
    eventId,
    actionGrant,
    loading: state.events.fetching,
    event,
    pools
  };
};

const mapDispatchToProps = {
  adminRegister
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ params: { eventId } }, dispatch) =>
    dispatch(fetchAdministrate(Number(eventId)))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(AdminRegister);
