import React from 'react';
import QuoteList from './QuoteList';
import styles from './Quotes.css';
import cx from 'classnames';
import { navigation } from '../utils';
import Button from 'app/components/Button';

type Props = {
  query: Object,
  quotes: Array<Object>,
  actionGrant: Array<String>,
  approve: number => void,
  unapprove: number => void,
  deleteQuote: number => void,
  loadMore: boolean => void,
  hasMore: boolean
};

export default function QuotePage({
  query,
  quotes,
  approve,
  unapprove,
  actionGrant,
  deleteQuote,
  loadMore,
  hasMore,
  ...props
}: Props) {
  let errorMessage = undefined;
  if (quotes.length === 0) {
    errorMessage =
      query.filter === 'unapproved'
        ? 'Ingen sitater venter på godkjenning.'
        : 'Fant ingen sitater. Hvis du har sendt inn et sitat venter det trolig på godkjenning.';
  }
  return (
    <div className={cx(styles.root, styles.quoteContainer)}>
      {navigation('Sitater', actionGrant)}

      {errorMessage || (
        <QuoteList
          approve={approve}
          unapprove={unapprove}
          deleteQuote={deleteQuote}
          actionGrant={actionGrant}
          quotes={quotes}
        />
      )}
      {hasMore && (
        <Button onClick={() => loadMore(query.filter !== 'unapproved')}>
          Load more
        </Button>
      )}
    </div>
  );
}
