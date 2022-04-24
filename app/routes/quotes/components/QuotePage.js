// @flow

import QuoteList from './QuoteList';
import { Helmet } from 'react-helmet-async';
import styles from './Quotes.css';
import cx from 'classnames';
import { navigation } from '../utils';
import Button from 'app/components/Button';
import type { ActionGrant, ID } from 'app/models';
import type { QuoteEntity } from 'app/reducers/quotes';
import type { EmojiEntity } from 'app/reducers/emojis';

type Props = {
  reactions: Array<Object>,
  query: { approved: string },
  quotes: Array<QuoteEntity>,
  actionGrant: ActionGrant,
  approve: (number) => Promise<*>,
  unapprove: (number) => Promise<*>,
  deleteQuote: (number) => Promise<*>,
  fetchAll: ({ query: { approved: string } }, next?: boolean) => Promise<*>,
  showFetchMore: boolean,
  currentUser: any,
  loggedIn: boolean,
  reactions: Object,
  addReaction: ({
    emoji: string,
    contentTarget: string,
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  fetchEmojis: () => Promise<*>,
  fetchingEmojis: boolean,
  emojis: Array<EmojiEntity>,
};

export default function QuotePage({
  query,
  quotes,
  approve,
  unapprove,
  actionGrant,
  deleteQuote,
  fetchAll,
  showFetchMore,
  currentUser,
  loggedIn,
  reactions,
  addReaction,
  deleteReaction,
  emojis,
  fetchEmojis,
  fetchingEmojis,
}: Props) {
  let errorMessage = undefined;
  if (quotes.length === 0) {
    errorMessage =
      query.approved === 'false'
        ? 'Ingen sitater venter på godkjenning.'
        : 'Fant ingen sitater. Hvis du har sendt inn et sitat venter det trolig på godkjenning.';
  }
  return (
    <div className={cx(styles.root, styles.quoteContainer)}>
      <Helmet title="Overhørt" />

      {navigation('Overhørt', actionGrant)}

      {errorMessage || (
        <QuoteList
          approve={approve}
          unapprove={unapprove}
          deleteQuote={deleteQuote}
          actionGrant={actionGrant}
          quotes={quotes}
          currentUser={currentUser}
          loggedIn={loggedIn}
          reactions={reactions}
          addReaction={addReaction}
          deleteReaction={deleteReaction}
          emojis={emojis}
          fetchEmojis={fetchEmojis}
          fetchingEmojis={fetchingEmojis}
        />
      )}
      {showFetchMore && (
        <Button onClick={() => fetchAll({ query, next: true })}>
          Last inn flere
        </Button>
      )}
    </div>
  );
}
