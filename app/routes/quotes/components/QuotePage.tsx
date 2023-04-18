import cx from 'classnames';
import qs from 'qs';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Button from 'app/components/Button';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type Quote from 'app/store/models/Quote';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import { navigation } from '../utils';
import QuoteList from './QuoteList';
import styles from './Quotes.css';

type Props = {
  query: {
    approved: string;
    ordering: string;
  };
  quotes: Quote[];
  actionGrant: ActionGrant;
  approve: (id: ID) => Promise<void>;
  unapprove: (id: ID) => Promise<void>;
  deleteQuote: (id: ID) => Promise<void>;
  fetchAll: (args: {
    query: {
      approved: string;
      ordering: string;
    };
    next?: boolean;
  }) => Promise<void>;
  showFetchMore: boolean;
  currentUser: CurrentUser;
  loggedIn: boolean;
  addReaction: (args: {
    emoji: string;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  deleteReaction: (args: {
    reactionId: ID;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  fetching: boolean;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
  emojis: Emoji[];
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
    // Update url with the new filtering/ordering params while ignoring the default values
    const searchObject = qs.parse(ordering.value, { ignoreQueryPrefix: true });
    if (query.approved === 'false') searchObject['approved'] = query.approved;
    const searchString = qs.stringify(searchObject, { addQueryPrefix: true });
    history.replace({
      search: searchString,
    });
  }, [history, ordering, query.approved]);

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
