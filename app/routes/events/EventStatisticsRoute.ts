import { compose } from 'redux';
import { connect } from 'react-redux';
import { getRegistrationGroups } from 'app/reducers/events';
import Statistics from 'app/routes/events/components/EventAdministrate/Statistics';
import { fetchAllWithType } from 'app/actions/GroupActions';
import prepare from 'app/utils/prepare';
import { selectGroupsWithType } from 'app/reducers/groups';
import { GroupTypeCommittee, GroupTypeRevue } from 'app/models';

const groups: {
  committee: typeof GroupTypeCommittee;
  revue: typeof GroupTypeRevue;
} = {
  committee: 'komite',
  revue: 'revy',
};

const mapStateToProps = (state, props) => {
  const { registered, unregistered } = getRegistrationGroups(state, {
    eventId: props.eventId,
  });

  return {
    committees: selectGroupsWithType(state, {
      groupType: groups.committee,
    }),
    revueGroups: selectGroupsWithType(state, {
      groupType: groups.revue,
    }),
    registered,
    unregistered,
  };
};

export default compose(
  prepare((_, dispatch) =>
    Promise.all([
      dispatch(fetchAllWithType(groups.committee)),
      dispatch(fetchAllWithType(groups.revue)),
    ])
  ),
  connect(mapStateToProps, {})
)(Statistics);
