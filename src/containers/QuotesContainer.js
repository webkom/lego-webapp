import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuotePage from '../components/quotes/QuotePage';
import { fetchAll } from '../actions/QuoteActions';

function loadData(props) {
  props.fetchAll();
}

@connect(
  (state) => ({
    quotes: state.quotes.items
  }),
  { fetchAll }
)
export default class QuotesContainer extends Component {

  componentWillMount() {
    loadData(this.props);
  }

  render() {
    return <QuotePage quotes = {this.props.quotes} />;
  }
}
