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
import QuotePage from './components/QuotePage';

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
export default class QuotesContainer extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    fetchAllApproved: PropTypes.func.isRequired,
    fetchAllUnapproved: PropTypes.func.isRequired,
    fetchQuote: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { query } = this.props;
    const { filter } = query;

    if (filter === 'unapproved') {
      this.props.fetchAllUnapproved();
    } else {
      this.props.fetchAllApproved();
    }
  }

  render() {
    return <QuotePage {...this.props} />;
  }
}
