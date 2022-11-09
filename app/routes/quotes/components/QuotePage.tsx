import cx from 'classnames';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Button from 'app/components/Button';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { ActionGrant, ID } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { QuoteEntity } from 'app/reducers/quotes';
import { navigation } from '../utils';
import QuoteList from './QuoteList';
import styles from './Quotes.css';

type Props = {
  reactions: Array<Record<string, any>>;
  query: {
    approved: string;
    ordering: string;
  };
  quotes: Array<QuoteEntity>;
  actionGrant: ActionGrant;
  approve: (arg0: number) => Promise<any>;
  unapprove: (arg0: number) => Promise<any>;
  deleteQuote: (arg0: number) => Promise<any>;
  fetchAll: (
    arg0: {
      query: {
        approved: string;
      };
    },
    next?: boolean
  ) => Promise<any>;
  showFetchMore: boolean;
  currentUser: any;
  loggedIn: boolean;
  reactions: Record<string, any>;
  addReaction: (arg0: { emoji: string; contentTarget: string }) => Promise<any>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<any>;
  fetching: boolean;
  fetchEmojis: () => Promise<any>;
  fetchingEmojis: boolean;
  emojis: Array<EmojiEntity>;
};
type Option = {
  label: string;
  value: string;
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
    history.replace({
      search: ordering.value,
    });
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
          <Button
            onClick={() =>
              fetchAll({
                query,
                next: true,
              })
            }
          >
            Last inn flere
          </Button>
        </LoadingIndicator>
      )}
    </div>
  );
}
