import styles from './Quotes.css';
import Time from 'app/components/Time';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Quote extends Component {
  static propTypes = {
    quote: PropTypes.object.isRequired,
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    approve: PropTypes.func.isRequired,
    unapprove: PropTypes.func.isRequired,
    deleteQuote: PropTypes.func.isRequired
  };

  render() {
    const { quote, like, unlike, approve, unapprove, deleteQuote } = this.props;

    return (
      <li className={styles.singleQuote}>
        <div className={styles.leftQuote}>
          <i
            className="fa fa-quote-right"
            style={{
              fontSize: '100px',
              color: '#dbdbdb',
              marginRight: '30px',
              order: '0',
              height: '0'
            }}
          />
          <h3 className={styles.theQuote}>
            <a href={`/quotes/${quote.id}`}>{quote.text}</a>
          </h3>

        </div>

        <div className={styles.quoteBottom}>

          <span className={styles.quoteSource}>
            <i>- {quote.source}</i>
          </span>

          <div className={styles.quoteDate}>
            {<Time time={quote.createdAt} wordsAgo />}
          </div>

          {quote.permissions &&
            quote.permissions.indexOf('can_approve') !== -1 &&
            <div className={styles.quoteAdmin}>
              <a
                className="approveQuote"
                onClick={() =>
                  quote.approved ? unapprove(quote.id) : approve(quote.id)}
              >
                {' '}{quote.approved ? 'Fjern Godkjenning' : 'Godkjenn'}
              </a>
              <a
                className={styles.deleteQuote}
                onClick={() => deleteQuote(quote.id)}
              >
                Slett
              </a>
            </div>}
        </div>
      </li>
    );
  }
}
