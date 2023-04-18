import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAllergies } from 'app/actions/EventActions';
import { getRegistrationGroups } from 'app/reducers/events';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Allergies from './components/EventAdministrate/Allergies';

const mapStateToProps = (state, props) => {
  const { eventId, event, actionGrant, loading, location } = props;
  const { registered, unregistered } = getRegistrationGroups(state, {
    eventId,
  });
  return {
    eventId,
    actionGrant,
    loading,
    location,
    event,
    registered,
    unregistered,
  };
};

export default compose(
  withPreparedDispatch('fetchAllergies', ({ match }, dispatch) =>
    dispatch(fetchAllergies(Number(match.params.eventId)))
  ),
  connect(mapStateToProps)
)(Allergies);
