import { connect } from 'react-redux';
import { compose } from 'redux';
import { sendContactMessage } from 'app/actions/ContactActions';
import { fetchAllWithType, fetchGroup } from 'app/actions/GroupActions';
import { addToast } from 'app/actions/ToastActions';
import { GroupType } from 'app/models';
import { selectGroup, selectGroupsWithType } from 'app/reducers/groups';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Contact from './components/Contact';

const commiteeGroupType = GroupType.Committee;
const revueBoardGroupId = 59;

const mapStateToProps = (state) => {
  const commitees = selectGroupsWithType(state, {
    groupType: commiteeGroupType,
  });

  const revueBoard = selectGroup(state, {
    groupId: revueBoardGroupId,
  });

  return {
    groups: [...commitees, revueBoard].filter(Boolean),
  };
};

const mapDispatchToProps = {
  sendContactMessage,
  addToast,
};
export default compose(
  withPreparedDispatch('fetchContact', (_, dispatch) =>
    Promise.all([
      dispatch(fetchAllWithType(commiteeGroupType)),
      dispatch(fetchGroup(revueBoardGroupId, { propagateError: false })),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Contact);
