import { connect } from 'react-redux';
import {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote
} from '../../actions/QuoteActions';
import QuoteDetail from './components/QuoteDetail';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectCommentsForQuote } from 'app/reducers/quotes';

function loadData(params, props) {
  props.fetchQuote(props.quoteId);
}

function mapStateToProps(state, props) {
  const query = props.location.query;
  const quoteId = props.params.quoteId;
  const quote = state.quotes.byId[quoteId];
  const comments = selectCommentsForQuote(state, quoteId);

  return {
    query,
    quote,
    quoteId,
    comments
  };
}

const mapDispatchToProps = {
  fetchQuote,
  approve,
  unapprove,
  deleteQuote
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['quoteId', 'loggedIn'], loadData)
)(QuoteDetail);
