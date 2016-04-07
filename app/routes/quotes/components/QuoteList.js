import React, { Component, PropTypes } from 'react';
import SingleQuote from './SingleQuote';

export default class QuoteList extends Component {

  static propTypes = {
    quotes: PropTypes.array.isRequired,
    sortType: PropTypes.string.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  render() {
    return (
      <ul>
        {this.props.quotes.map((quote) =>
          <SingleQuote
            {...this.props}
            quote={quote}
            key={quote.id}
          />
        )}
      </ul>
    );
  }
}
