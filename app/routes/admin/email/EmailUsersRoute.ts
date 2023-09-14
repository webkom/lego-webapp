import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { fetch } from 'app/actions/EmailUserActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { GroupType } from 'app/models';
import { selectEmailUsers } from 'app/reducers/emailUsers';
import { selectGroupsWithType } from 'app/reducers/groups';
import { selectPaginationNext } from 'app/reducers/selectors';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EmailUsers from './components/EmailUsers';

const mapStateToProps = (state) => {
  const { search } = state.router.location;
  const { filters: qsFilters } = qs.parse(search.slice(1));
  const filters = JSON.parse(typeof qsFilters === 'string' ? qsFilters : '{}');
  const {
    'user.fullName': userFullname,
    internalEmail: email,
    userCommittee,
    userGrade,
    internalEmailEnabled: enabled,
  } = filters;
  const query = {
    userFullname,
    email,
    userCommittee,
    userGrade,
    enabled,
  };
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
    filters,
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
