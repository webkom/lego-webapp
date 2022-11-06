import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailLists from './components/EmailLists';
import { fetch } from 'app/actions/EmailListActions';
import { selectEmailLists } from 'app/store/slices/emailListsSlice';
import { push } from 'connected-react-router';
import { selectPaginationNext } from 'app/store/slices/selectorsSlice';
import qs from 'qs';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

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
    emailLists: selectEmailLists(state, {
      pagination,
    }),
    fetching: state.emailLists.fetching,
    hasMore: pagination.hasMore,
    pagination,
    query,
    filters,
  };
};

const mapDispatchToProps = {
  fetch,
  push,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPreparedDispatch('fetchEmailLists', ({ query }, dispatch) =>
    dispatch(fetch({ query }))
  )
)(EmailLists);
