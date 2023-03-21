import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchEmojis } from 'app/actions/EmojiActions';
import {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote,
} from 'app/actions/QuoteActions';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectEmojis } from 'app/reducers/emojis';
import { selectQuoteById } from 'app/reducers/quotes';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import QuotePage from './components/QuotePage';

const mapStateToProps = (state, props) => {
  const query = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });
  const quoteId = props.match.params.quoteId;
  const quotes = [selectQuoteById(state, quoteId)];
  const emojis = selectEmojis(state);
  const actionGrant = state.quotes.actionGrant;
  return {
    query,
    quotes,
    quoteId,
    emojis,
    actionGrant,
  };
};

const mapDispatchToProps = {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote,
  addReaction,
  deleteReaction,
  fetchEmojis,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch(
    'fetchQuoteDetail',
    (props, dispatch) =>
      dispatch(fetchQuote(props.match.params.quoteId), fetchEmojis()),
    (props) => [props.match.params.quoteId]
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(QuotePage);
