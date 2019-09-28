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
import { selectSortedQuotes } from 'app/reducers/quotes';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectPagination } from '../../reducers/selectors';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import { selectEmojis } from 'app/reducers/emojis';
import { fetchEmojis } from 'app/actions/EmojiActions';
import qs from 'qs';

const mapStateToProps = (state, props) => {
  const queryString = ['?approved=true', '?approved=false'];
  const showFetchMore = selectPagination('quotes', { queryString })(state);
  const emojis = selectEmojis(state);
  return {
    quotes: selectSortedQuotes(
      state,
      qs.parse(props.location.search, { ignoreQueryPrefix: true })
    ),
    query: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    actionGrant: state.quotes.actionGrant,
    showFetchMore,
    emojis,
    fetching: state.quotes.fetching,
    fetchingEmojis: state.emojis.fetching
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
  addReaction,
  deleteReaction,
  fetchEmojis
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => {
    const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });

    if (query.filter === 'unapproved') {
      return dispatch(
        fetchAllUnapproved({ loadNextPage: false }),
        fetchEmojis()
      );
    }
    return dispatch(fetchAllApproved({ loadNextPage: false }), fetchEmojis());
  }),
    ['location']
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(QuotePage);
