import { connect } from 'react-redux';
import {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote
} from '../../actions/QuoteActions';
import QuotePage from './components/QuotePage';
import { compose } from 'redux';
import { selectQuoteById } from 'app/reducers/quotes';
import { LoginPage } from 'app/components/LoginForm';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import { selectEmojis } from 'app/reducers/emojis';
import { fetchEmojis } from 'app/actions/EmojiActions';

const loadData = ({ match: { params } }, dispatch) =>
  dispatch(fetchQuote(params.quoteId), fetchEmojis());

const mapStateToProps = (state, props) => {
  const query = props.location.query;
  const quoteId = props.match.params.quoteId;
  const quotes = [selectQuoteById(state, quoteId)];
  const emojis = selectEmojis(state);
  const actionGrant = state.quotes.actionGrant;

  return {
    query,
    quotes,
    quoteId,
    emojis,
    actionGrant
  };
};

const mapDispatchToProps = {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote,
  addReaction,
  deleteReaction,
  fetchEmojis
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['match.params.quoteId']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(QuotePage);
