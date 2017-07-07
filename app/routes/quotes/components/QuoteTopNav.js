import React from 'react';
import { Link } from 'react-router';
import styles from './Quotes.css';

type Props = {
  sortType: String,
  query: Object
};

export default function QuoteTopNav({ sortType, query, ...props }: Props) {
  return (
    <div>
      <div className={styles.quoteTop}>
        <h1>Sitater!</h1>
        <div className={styles.sortQuote}>
          Sorter etter:
          <Link
            to={
              query.filter === 'unapproved'
                ? '/quotes?filter=unapproved'
                : '/quotes'
            }
            className={
              sortType === 'date' ? 'selectedQuoteSort' : 'unselectedQuoteSort'
            }
          >
            Dato
          </Link>
          <Link
            to={
              query.filter === 'unapproved'
                ? '/quotes?filter=unapproved&sort=likes'
                : '/quotes?sort=likes'
            }
            className={
              sortType === 'likes' ? 'selectedQuoteSort' : 'unselectedQuoteSort'
            }
          >
            Likes
          </Link>
        </div>
      </div>
      <div className={styles.clear} />
    </div>
  );
}
