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
import LoadingIndicator from 'app/components/LoadingIndicator';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import { useHistory } from 'react-router-dom';

type Props = {
  reactions: Array<Object>,
  query: { approved: string, ordering: string },
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
  fetching: boolean,
  fetchEmojis: () => Promise<*>,
  fetchingEmojis: boolean,
  emojis: Array<EmojiEntity>,
};

type Option = {
  label: string,
  value: string,
};

const filterRegDateOptions: Array<Option> = [
  {
    label: 'nyeste',
    value: '',
  },
  {
    label: 'flest emojis',
    value: '?ordering=-reaction_count',
  },
];

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
  fetching,
  fetchEmojis,
  fetchingEmojis,
}: Props) {
  let errorMessage = undefined;
  if (quotes.length === 0 && !fetching) {
    errorMessage =
      query.approved === 'false'
        ? 'Ingen sitater venter på godkjenning.'
        : 'Fant ingen sitater. Hvis du har sendt inn et sitat venter det trolig på godkjenning.';
  }

  const history = useHistory();
  const [ordering, setOrdering] = useState<Option>(
    query.ordering === '-reaction_count'
      ? filterRegDateOptions[1]
      : filterRegDateOptions[0]
  );

  const handleChange = (event) => {
    setOrdering(event);
  };

  useEffect(() => {
    history.replace({ search: ordering.value });
  }, [history, ordering]);

  return (
    <div className={cx(styles.root, styles.quoteContainer)}>
      <Helmet title="Overhørt" />
      {navigation('Overhørt', actionGrant)}

      <div className={styles.select}>
        <div>Sorter etter:</div>
        <Select
          name="sorting_selector"
          value={ordering}
          onChange={handleChange}
          isClearable={false}
          theme={selectTheme}
          styles={selectStyles}
          options={filterRegDateOptions}
        />
      </div>

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
        <LoadingIndicator loading={fetching}>
          <Button onClick={() => fetchAll({ query, next: true })}>
            Last inn flere
          </Button>
        </LoadingIndicator>
      )}
    </div>
  );
}
