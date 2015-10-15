import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchAll, like } from '../actions/QuoteActions';
import QuotePage from '../components/quotes/QuotePage';

function loadData(props) {
  props.fetchAll();
}

@connect(state => ({
    quotes: state.quotes.items
  }),
  { fetchAll, like }
)

export default class QuotesContainer extends Component {

  componentWillMount() {
    loadData(this.props);
  }

  render() {
    return <QuotePage {...this.props} />;
  }
}
