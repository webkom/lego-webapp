import { compose } from 'redux';
import { connect } from 'react-redux';
import { getRegistrationGroups } from 'app/reducers/events';
import Statistics from 'app/routes/events/components/EventAdministrate/Statistics';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { selectGroupsWithType } from 'app/reducers/groups';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import { GroupType } from 'app/models';

const mapStateToProps = (state, props) => {
  const { registered, unregistered } = getRegistrationGroups(state, {
    eventId: props.eventId,
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
  };
};

export default compose(
  withPreparedDispatch('fetchStatisticsGroups', (_, dispatch) =>
    Promise.all([
      dispatch(fetchAllWithType(GroupType.Committee)),
      dispatch(fetchAllWithType(GroupType.Revue)),
    ])
  ),
  connect(mapStateToProps, {})
)(Statistics);
