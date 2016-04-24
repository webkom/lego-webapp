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
import QuoteSingleRoute from './components/QuoteSingleRoute';

@connect((state, props) => ({
  quotes: state.quotes.items.map((id) => state.entities.quotes[id]),
  query: props.location.query
}),
  {
    fetchAllApproved,
    fetchAllUnapproved,
    fetchQuote,
    like,
    unlike,
    approve,
    unapprove,
    deleteQuote
  }
)
export default class QuotesSingleRouteContainer extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    quotes: PropTypes.array.isRequired,
    fetchQuote: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.fetchQuote(this.props.params.quoteId);
  }

  render() {
    return <QuoteSingleRoute {...this.props} />;
  }
}
