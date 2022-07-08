import { connect } from 'react-redux';
import qs from 'qs';
import { compose } from 'redux';

import { fetchEmojis } from 'app/actions/EmojiActions';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectEmojis } from 'app/reducers/emojis';
import { selectQuoteById } from 'app/reducers/quotes';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import {
  approve,
  deleteQuote,
  fetchQuote,
  unapprove,
} from '../../actions/QuoteActions';
import QuotePage from './components/QuotePage';

const loadData = ({ match: { params } }, dispatch) =>
  dispatch(fetchQuote(params.quoteId), fetchEmojis());

const mapStateToProps = (state, props) => {
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
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
  prepare(loadData, ['match.params.quoteId']),
  connect(mapStateToProps, mapDispatchToProps)
)(QuotePage);
