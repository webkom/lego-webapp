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
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  props.fetchQuote(props.quote.id);
}

function mapStateToProps(state, props) {
  const quotes = state.quotes.items.map(id => state.quotes.byId[id]);
  const query = props.location.query;
  const comments = selectCommentsForQuote(state, props);

  return {
    quote: quotes[0],
    query,
    comments
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['quote', 'loggedIn'], loadData)
)(QuoteDetail);
