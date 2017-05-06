import React from 'react';
import QuoteRightNav from './QuoteRightNav';
import QuoteList from './QuoteList';
import styles from './Quotes.css';
import cx from 'classnames';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  query: Object,
  quotes: Array<Object>,
  actionGrant: Array<Object>
};

export default function QuotePage({ query, quotes, ...props }: Props) {
  if (quotes.length === 0) {
    return <LoadingIndicator loading />;
  }
  return (
    <div className={cx(styles.root, styles.quoteContainer)}>
      <div className={styles.quotepageLeft}>
        <div className={styles.quoteTop}>
          <h1>Sitater!</h1>
        </div>
        <QuoteList {...props} quotes={quotes} />

      </div>

      <QuoteRightNav query={query} actionGrant={props.actionGrant} />
    </div>
  );
}
