import React from 'react';
import QuoteRightNav from './QuoteRightNav';
import QuoteList from './QuoteList';
import styles from './Quotes.css';
import cx from 'classnames';

type Props = {
  query: Object,
  quotes: Array<Object>,
  actionGrant: Array<String>
};

export default function QuotePage({ query, quotes, ...props }: Props) {
  let errorMessage = undefined;
  if (quotes.length === 0) {
    errorMessage =
      query.filter === 'unapproved'
        ? 'Ingen sitater venter på godkjenning.'
        : 'Fant ingen sitater. Hvis du har sendt inn et sitat venter det trolig på godkjenning.';
  }
  return (
    <div className={cx(styles.root, styles.quoteContainer)}>
      <div className={styles.quotepageLeft}>
        <div className={styles.quoteTop}>
          <h1>Sitater</h1>
        </div>
        {errorMessage || <QuoteList {...props} quotes={quotes} />}
      </div>

      <QuoteRightNav query={query} actionGrant={props.actionGrant} />
    </div>
  );
}
