import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchQuote, approve, unapprove, deleteQuote } from '../../actions/QuoteActions';
import QuoteDetail from './components/QuoteDetail';
import { compose } from 'redux';
import { selectQuoteById, selectCommentsForQuote } from 'app/reducers/quotes';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const query = props.location.query;
  const quoteId = props.params.quoteId;
  const quote = selectQuoteById(state, quoteId);
  const comments = selectCommentsForQuote(state, quoteId);
  const actionGrant = state.quotes.actionGrant;

  return {
    query,
    quote,
    quoteId,
    comments,
    actionGrant
  };
};

const mapDispatchToProps = {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(({ params: { quoteId } }, dispatch) => dispatch(fetchQuote(quoteId)), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(QuoteDetail);
