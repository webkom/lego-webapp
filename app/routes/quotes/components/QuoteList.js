import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quote from './Quote';

export default class QuoteList extends Component {
  static propTypes = {
    quotes: PropTypes.array.isRequired,
    sortType: PropTypes.string.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  render() {
    return (
      <ul>
        {this.props.quotes.map(quote => (
          <Quote {...this.props} quote={quote} key={quote.id} />
        ))}
      </ul>
    );
  }
}
