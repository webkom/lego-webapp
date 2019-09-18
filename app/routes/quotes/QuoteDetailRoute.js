import { connect } from 'react-redux';
import {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote
} from '../../actions/QuoteActions';
import QuotePage from './components/QuotePage';
import { compose } from 'redux';
import { selectQuoteById, selectReactionsForQuote } from 'app/reducers/quotes';
import { LoginPage } from 'app/components/LoginForm';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';

const loadData = ({ params }, dispatch) => dispatch(fetchQuote(params.quoteId));

const mapStateToProps = (state, props) => {
  const query = props.location.query;
  const quoteId = props.params.quoteId;
  const quotes = [selectQuoteById(state, quoteId)];
  const reactions = selectReactionsForQuote(state, { quoteId });
  const actionGrant = state.quotes.actionGrant;

  return {
    query,
    quotes,
    quoteId,
    reactions,
    actionGrant
  };
};

const mapDispatchToProps = {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote,
  addReaction,
  deleteReaction
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.quoteId']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(QuotePage);
