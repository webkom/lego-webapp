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

const mapStateToProps = (state, props) => {
  const queryString = ['?approved=true', '?approved=false'];
  const showFetchMore = selectPagination('quotes', { queryString })(state);
  const emojis = selectEmojis(state);
  return {
    quotes: selectSortedQuotes(state, props.location.query),
    query: props.location.query,
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
    const {
      location: { query }
    } = props;
    if (query.filter === 'unapproved') {
      return dispatch(
        fetchAllUnapproved({ loadNextPage: false }),
        fetchEmojis()
      );
    }
    return dispatch(fetchAllApproved({ loadNextPage: false }), fetchEmojis());
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(QuotePage);
