import React, { Component, PropTypes } from 'react';
import SingleQuote from './SingleQuote';

export default class QuotePage extends Component {

  logthisShit() {
    console.log("quotes: ",this.props.quotes)
  }

  render() {
    const quotes = this.props.quotes;

    return (
      <div className="u-container">
        {this.logthisShit()}
        <h1>Quotes!</h1>
        <ul>
          {quotes.map((quote, index) =>
            <SingleQuote
              quote = {quote}
              key = {index}
            />
          )}
        </ul>
      </div>
    );
  }
}
