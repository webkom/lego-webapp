import { compose } from "redux";
import { connect } from "react-redux";
import { fetchAll, approve, unapprove, deleteQuote } from "app/actions/QuoteActions";
import QuotePage from "./components/QuotePage";
import prepare from "app/utils/prepare";
import { selectQuotes } from "app/reducers/quotes";
import { LoginPage } from "app/components/LoginForm";
import replaceUnlessLoggedIn from "app/utils/replaceUnlessLoggedIn";
import { selectPaginationNext } from "app/reducers/selectors";
import { addReaction, deleteReaction } from "app/actions/ReactionActions";
import { selectEmojis } from "app/reducers/emojis";
import { fetchEmojis } from "app/actions/EmojiActions";
import qs from "qs";

const qsParamsParser = search => ({
  approved: qs.parse(search, {
    ignoreQueryPrefix: true
  }).approved || 'true',
  ordering: qs.parse(search, {
    ignoreQueryPrefix: true
  }).ordering
});

const mapStateToProps = (state, props) => {
  const {
    pagination
  } = selectPaginationNext({
    endpoint: `/quotes/`,
    query: qsParamsParser(props.location.search),
    entity: 'quotes'
  })(state);
  const emojis = selectEmojis(state);
  return {
    quotes: selectQuotes(state, {
      pagination
    }),
    query: pagination.query,
    actionGrant: state.quotes.actionGrant,
    showFetchMore: pagination.hasMore,
    emojis,
    fetching: state.quotes.fetching,
    fetchingEmojis: state.emojis.fetching
  };
};

const mapDispatchToProps = {
  approve,
  unapprove,
  deleteQuote,
  fetchAll,
  addReaction,
  deleteReaction,
  fetchEmojis
};
export default compose(replaceUnlessLoggedIn(LoginPage), prepare((props, dispatch) => dispatch(fetchAll({
  query: qsParamsParser(props.location.search)
})), ['location']), connect(mapStateToProps, mapDispatchToProps))(QuotePage);