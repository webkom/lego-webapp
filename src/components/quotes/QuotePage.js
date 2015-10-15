import React, { Component, PropTypes } from 'react';
import SingleQuote from './SingleQuote';

export default class QuotePage extends Component {

  render() {
    const quotes = this.props.quotes;

    return (
      <div className="u-container">
        <h1>Quotes!</h1>
        <ul>
          {quotes.map((quote, index) =>
            <SingleQuote
              {...this.props}
              quote = {quote}
              key = {index}
            />
          )}
        </ul>
      </div>
    );
  }
}
