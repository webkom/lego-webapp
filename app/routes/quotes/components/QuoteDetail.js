import React, { Component, PropTypes } from 'react';
import styles from './QuoteDetail.css';
import Quote from './Quote';

export default class QuoteDetail extends Component {

  static propTypes = {
    quote: PropTypes.object.isRequired,
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    approve: PropTypes.func.isRequired,
    unapprove: PropTypes.func.isRequired,
    deleteQuote: PropTypes.func.isRequired
  };

  render() {
    const { quote } = this.props;

    if (!quote) {
      return null;
    }
    return (
      <div className={styles.root}>
        <div className={styles.quoteSingleroute}>

          <h1>Enkelt sitat!</h1>

          <Quote {...this.props} quote={quote} />

        </div>
      </div>
    );
  }
}
