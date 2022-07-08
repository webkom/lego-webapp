// @flow

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import qs from 'qs';
import { compose } from 'redux';

import { fetch } from 'app/actions/EmailListActions';
import { selectEmailLists } from 'app/reducers/emailLists';
import { selectPaginationNext } from 'app/reducers/selectors';
import prepare from 'app/utils/prepare';
import EmailLists from './components/EmailLists';

const mapStateToProps = (state) => {
  const { search } = state.router.location;
  const { filters: qsFilters } = qs.parse(search.slice(1));
  const filters = JSON.parse(typeof qsFilters === 'string' ? qsFilters : '{}');
  const { name, email, requireInternalAddress } = filters;

  const query = {
    name,
    email,
    requireInternalAddress,
  };
  const { pagination } = selectPaginationNext({
    endpoint: '/email-lists/',
    entity: 'emailLists',
    query,
  })(state);
  return {
    emailLists: selectEmailLists(state, { pagination }),
    fetching: state.emailLists.fetching,
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
)(EmailLists);
