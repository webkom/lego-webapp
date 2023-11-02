import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchEmojis } from 'app/actions/EmojiActions';
import {
  fetchAll,
  approve,
  unapprove,
  deleteQuote,
} from 'app/actions/QuoteActions';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectEmojis } from 'app/reducers/emojis';
import { selectQuotes } from 'app/reducers/quotes';
import { selectPaginationNext } from 'app/reducers/selectors';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { parseQueryString } from 'app/utils/useQuery';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import QuotePage from './components/QuotePage';

export const defaultQuotesQuery = {
  approved: 'true',
  ordering: '-created_at',
};

const mapStateToProps = (state, props) => {
  const { pagination } = selectPaginationNext({
    endpoint: `/quotes/`,
    query: parseQueryString(props.location.search, defaultQuotesQuery),
    entity: 'quotes',
  })(state);
  const emojis = selectEmojis(state);
  return {
    quotes: selectQuotes(state, {
      pagination,
    }),
    actionGrant: state.quotes.actionGrant,
    showFetchMore: pagination.hasMore,
    emojis,
    fetching: state.quotes.fetching,
    fetchingEmojis: state.emojis.fetching,
  };
};

const mapDispatchToProps = {
  approve,
  unapprove,
  deleteQuote,
  fetchAll,
  addReaction,
  deleteReaction,
  fetchEmojis,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch(
    'fetchQuotes',
    (props, dispatch) =>
      dispatch(
        fetchAll({
          query: parseQueryString(props.location.search, defaultQuotesQuery),
        })
      ),
    (props) => [props.location]
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(QuotePage);
