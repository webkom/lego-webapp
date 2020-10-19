// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailUsers from './components/EmailUsers';
import { fetch } from 'app/actions/EmailUserActions';
import { selectEmailUsers } from 'app/reducers/emailUsers';
import prepare from 'app/utils/prepare';
import { selectPaginationNext } from 'app/reducers/selectors';
import { push } from 'connected-react-router';
import qs from 'qs';

const mapStateToProps = (state) => {
  const { search } = state.router.location;
  const { filters: qsFilters = '{}' } = qs.parse(search.slice(1));
  const filters = JSON.parse(qsFilters);
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
  };
};

const mapDispatchToProps = { fetch, push };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare(({ query }, dispatch) => dispatch(fetch({ query })))
)(EmailUsers);
