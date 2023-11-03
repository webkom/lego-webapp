import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetch } from 'app/actions/EmailListActions';
import { selectEmailLists } from 'app/reducers/emailLists';
import { selectPaginationNext } from 'app/reducers/selectors';
import { parseQueryString } from 'app/utils/useQuery';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EmailLists from './components/EmailLists';

export const emailListsDefaultQuery = {
  name: '',
  email: '',
  requireInternalAddress: undefined as undefined | 'true' | 'false',
};

const mapStateToProps = (state) => {
  const query = parseQueryString(
    state.router.location.search,
    emailListsDefaultQuery
  );
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
