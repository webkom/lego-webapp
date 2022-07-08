// @flow

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import qs from 'qs';
import { compose } from 'redux';

import { fetch } from 'app/actions/EmailUserActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { GroupTypeCommittee, GroupTypeGrade } from 'app/models';
import { selectEmailUsers } from 'app/reducers/emailUsers';
import { selectGroupsWithType } from 'app/reducers/groups';
import { selectPaginationNext } from 'app/reducers/selectors';
import prepare from 'app/utils/prepare';
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
    emailUsers: selectEmailUsers(state, { pagination }),
    fetching: state.emailUsers.fetching,
    hasMore: pagination.hasMore,
    pagination,
    query,
    filters,
    committees: selectGroupsWithType(state, { groupType: GroupTypeCommittee }),
    grades: selectGroupsWithType(state, { groupType: GroupTypeGrade }),
  };
};

const mapDispatchToProps = { fetch, push };

export default compose(
  prepare(
    (_, dispatch) =>
      Promise.all([
        dispatch(fetchAllWithType(GroupTypeCommittee)),
        dispatch(fetchAllWithType(GroupTypeGrade)),
      ]),
    [],
    { awaitOnSsr: false }
  ),
  connect(mapStateToProps, mapDispatchToProps),
  prepare(({ query }, dispatch) => dispatch(fetch({ query })))
)(EmailUsers);
