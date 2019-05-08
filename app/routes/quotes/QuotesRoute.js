import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchAllApproved,
  fetchAllUnapproved,
  approve,
  unapprove,
  deleteQuote
} from 'app/actions/QuoteActions';
import QuotePage from './components/QuotePage';
import prepare from 'app/utils/prepare';
import {
  selectSortedQuotes,
  selectCommentsForQuotes
} from 'app/reducers/quotes';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectPagination } from '../../reducers/selectors';
import { deleteComment } from 'app/actions/CommentActions';

const mapStateToProps = (state, props) => {
  const queryString = ['?approved=true', '?approved=false'];
  const showFetchMore = selectPagination('quotes', { queryString })(state);
  return {
    quotes: selectSortedQuotes(state, props.location.query),
    query: props.location.query,
    actionGrant: state.quotes.actionGrant,
    showFetchMore,
    comments: selectCommentsForQuotes(state, props)
  };
};

const mapDispatchToProps = {
  fetchAllApproved,
  fetchAllUnapproved,
  approve,
  unapprove,
  deleteQuote,
  fetchMore: ({ approved }) =>
    approved
      ? fetchAllApproved({ loadNextPage: true })
      : fetchAllUnapproved({ loadNextPage: true }),
  deleteComment
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => {
    const {
      location: { query }
    } = props;
    if (query.filter === 'unapproved') {
      return dispatch(fetchAllUnapproved({ loadNextPage: false }));
    }
    return dispatch(fetchAllApproved({ loadNextPage: false }));
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(QuotePage);
