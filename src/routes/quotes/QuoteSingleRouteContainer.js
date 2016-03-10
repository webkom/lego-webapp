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
  deleter
} from '../../actions/QuoteActions';
import QuoteSingleRoute from './components/QuoteSingleRoute';

@connect(state => ({
  quotes: state.quotes.items,
  query: state.router.location.query
}),
  {
    fetchAllApproved,
    fetchAllUnapproved,
    fetchQuote,
    like,
    unlike,
    approve,
    unapprove,
    deleter
  }
)
export default class QuotesSingleRouteContainer extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    quotes: PropTypes.array.isRequired,
    fetchQuote: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.fetchQuote(this.props.params.quoteId);
  }

  render() {
    console.log('props: ', this.props);
    return <QuoteSingleRoute {...this.props} />;
  }
}
