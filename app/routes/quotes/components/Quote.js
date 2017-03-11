import styles from './Quotes.css';
import Time from 'app/components/Time';
import React, { Component } from 'react';
import { Link } from 'react-router';

type Props = {
  quote: Object,
  deleteQuote: () => void,
  approve: () => void,
  unapprove: () => void
};

export default class Quote extends Component {
  props: Props;

  render() {
    const { quote, approve, unapprove, deleteQuote } = this.props;

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

          <div className={styles.commentCount}>
            <Link to={`/quotes/${quote.id}`}>
              <i className="fa fa-comment-o" /> {(quote.comments || []).length}
            </Link>
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
