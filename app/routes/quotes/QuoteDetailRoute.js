import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchAllApproved,
  fetchAllUnapproved,
  fetchQuote,
  like,
  unlike,
  approve,
  unapprove,
  deleteQuote
} from '../../actions/QuoteActions';
import QuoteDetail from './components/QuoteDetail';

export class QuotesDetailRoute extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    quote: PropTypes.object.isRequired,
    fetchQuote: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.fetchQuote(this.props.params.quoteId);
  }

  render() {
    return <QuoteDetail {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  const quotes = state.quotes.items.map((id) => state.quotes.byId[id]);
  const query = props.location.query;

  return {
    quote: quotes[0],
    query
  };
}

const mapDispatchToProps = {
  fetchAllApproved,
  fetchAllUnapproved,
  fetchQuote,
  like,
  unlike,
  approve,
  unapprove,
  deleteQuote
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(QuotesDetailRoute);
