import qs from 'qs';
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
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import QuotePage from './components/QuotePage';

const qsParamsParser = (search) => ({
  approved:
    qs.parse(search, {
      ignoreQueryPrefix: true,
    }).approved || 'true',
  ordering: qs.parse(search, {
    ignoreQueryPrefix: true,
  }).ordering,
});

const mapStateToProps = (state, props) => {
  const { pagination } = selectPaginationNext({
    endpoint: `/quotes/`,
    query: qsParamsParser(props.location.search),
    entity: 'quotes',
  })(state);
  const emojis = selectEmojis(state);
  return {
    quotes: selectQuotes(state, {
      pagination,
    }),
    query: pagination.query,
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
          query: qsParamsParser(props.location.search),
        })
      ),
    (props) => [props.location]
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(QuotePage);
