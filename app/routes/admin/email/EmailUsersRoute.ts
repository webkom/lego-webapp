import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetch } from 'app/actions/EmailUserActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { GroupType } from 'app/models';
import { selectEmailUsers } from 'app/reducers/emailUsers';
import { selectGroupsWithType } from 'app/reducers/groups';
import { selectPaginationNext } from 'app/reducers/selectors';
import { parseQueryString } from 'app/utils/useQuery';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EmailUsers from './components/EmailUsers';

export const emailUsersDefaultQuery = {
  enabled: undefined as undefined | 'true' | 'false',
  userGrade: undefined as undefined | string,
  userCommittee: undefined as undefined | string,
  email: '',
  userFullname: '',
};

const mapStateToProps = (state) => {
  const query = parseQueryString(
    state.router.location.search,
    emailUsersDefaultQuery
  );
  const { pagination } = selectPaginationNext({
    endpoint: '/email-users/',
    entity: 'emailUsers',
    query,
  })(state);
  return {
    emailUsers: selectEmailUsers(state, {
      pagination,
    }),
    fetching: state.emailUsers.fetching,
    hasMore: pagination.hasMore,
    pagination,
    query,
    committees: selectGroupsWithType(state, {
      groupType: GroupType.Committee,
    }),
    grades: selectGroupsWithType(state, {
      groupType: GroupType.Grade,
    }),
  };
};

const mapDispatchToProps = {
  fetch,
  push,
};
export default compose(
  withPreparedDispatch('fetchEmailUsersGroups', (_, dispatch) =>
    Promise.all([
      dispatch(fetchAllWithType(GroupType.Committee)),
      dispatch(fetchAllWithType(GroupType.Grade)),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps),
  withPreparedDispatch('fetchEmailUsers', ({ query }, dispatch) =>
    dispatch(fetch({ query }))
  )
)(EmailUsers);
