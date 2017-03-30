import styles from './Quotes.css';
import Time from 'app/components/Time';
import React from 'react';
import { Link } from 'react-router';

type Props = {
  quote: Object,
  deleteQuote: () => void,
  approve: () => void,
  unapprove: () => void
};

export default function Quote(
  { quote, approve, unapprove, deleteQuote }: Props
) {
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
          <Link to={`/quotes/${quote.id}`}>{quote.text}</Link>
        </h3>

      </div>

      <div className={styles.quoteBottom}>

        <span className={styles.quoteSource}>
          <i>- {quote.source}</i>
        </span>

        <div className={styles.bottomRight}>

          <div className={styles.quoteDate}>
            {<Time time={quote.createdAt} wordsAgo />}
          </div>

          <div className={styles.commentCount}>
            <Link to={`/quotes/${quote.id}`}>
              <i className="fa fa-comment-o" />
              {' '}
              {(quote.comments || []).length}
            </Link>
          </div>

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
