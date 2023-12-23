import { LoadingIndicator, Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Helmet } from 'react-helmet-async';
import { SelectInput } from 'app/components/Form';
import { defaultQuotesQuery } from 'app/routes/quotes/QuotesRoute';
import useQuery from 'app/utils/useQuery';
import { navigation } from '../utils';
import QuoteList from './QuoteList';
import styles from './Quotes.css';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type Quote from 'app/store/models/Quote';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  quoteId?: ID;
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
const orderingOptions: Array<Option> = [
  {
    label: 'nyeste',
    value: '-created_at',
  },
  {
    label: 'flest reaksjoner',
    value: '-reaction_count',
  },
];
export default function QuotePage({
  quoteId,
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
  const isSingle = !!quoteId;

  let errorMessage: string | undefined = undefined;

  const { query, setQueryValue } = useQuery(defaultQuotesQuery);

  if (quotes.length === 0 && !fetching) {
    errorMessage = query.approved
      ? 'Fant ingen sitater. Hvis du har sendt inn et sitat venter det trolig på godkjenning.'
      : 'Ingen sitater venter på godkjenning.';
  }

  const ordering = orderingOptions.find(
    (option) => option.value === query.ordering
  );

  return (
    <div className={cx(styles.root, styles.quoteContainer)}>
      <Helmet title="Overhørt" />
      {navigation('Overhørt', actionGrant)}

      {!isSingle && (
        <div className={styles.select}>
          <div>Sorter etter:</div>
          <SelectInput
            name="sorting_selector"
            value={ordering}
            onChange={(option) =>
              option && setQueryValue('ordering')(option.value)
            }
            isClearable={false}
            options={orderingOptions}
          />
        </div>
      )}

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
