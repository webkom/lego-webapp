import React, { Component, PropTypes } from 'react';
import styles from './QuoteDetail.css';
import SingleQuote from './SingleQuote';

export default class QuoteDetail extends Component {

  static propTypes = {
    quotes: PropTypes.array.isRequired,
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    approve: PropTypes.func.isRequired,
    unapprove: PropTypes.func.isRequired,
    deleteQuote: PropTypes.func.isRequired
  };

  render() {
    const quote = this.props.quotes[0];

    if (!quote) {
      return null;
    }
    return (
      <div className={styles.root}>
        <div className={styles.quoteSingleroute}>

          <h1>Enkelt sitat!</h1>

          <SingleQuote {...this.props} quote={quote} />

        </div>
      </div>
    );
  }
}
