import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { GroupType } from 'app/models';
import { getRegistrationGroups } from 'app/reducers/events';
import { selectGroupsWithType } from 'app/reducers/groups';
import Statistics from 'app/routes/events/components/EventAdministrate/Statistics';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const { eventId, event } = props;
  const { registered, unregistered } = getRegistrationGroups(state, {
    eventId: eventId,
  });

  return {
    committees: selectGroupsWithType(state, {
      groupType: GroupType.Committee,
    }),
    revueGroups: selectGroupsWithType(state, {
      groupType: GroupType.Revue,
    }),
    registered,
    unregistered,
    event,
  };
};

export default compose(
  withPreparedDispatch('fetchStatisticsGroups', (_, dispatch) =>
    Promise.all([
      dispatch(fetchAllWithType(GroupType.Committee)),
      dispatch(fetchAllWithType(GroupType.Revue)),
    ]),
  ),
  connect(mapStateToProps, {}),
)(Statistics);
