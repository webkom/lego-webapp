import { useState } from 'react';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type QuoteType from 'app/store/models/Quote';
import Quote from './Quote';

type Props = {
  quotes: QuoteType[];
  actionGrant: ActionGrant;
  loggedIn: boolean;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
  emojis: Emoji[];
};

const QuoteList = ({
  quotes,
  actionGrant,
  loggedIn,
  emojis,
  fetchEmojis,
  fetchingEmojis,
}: Props) => {
  const [displayAdminId, setDisplayAdminId] = useState<ID>();

  return (
    <ul>
      {quotes.filter(Boolean).map((quote) => (
        <Quote
          actionGrant={actionGrant}
          quote={quote}
          key={quote.id}
          toggleDisplayAdmin={() =>
            setDisplayAdminId(
              quote.id === displayAdminId ? undefined : quote.id
            )
          }
          displayAdmin={quote.id === displayAdminId}
          loggedIn={loggedIn}
          emojis={emojis}
          fetchEmojis={fetchEmojis}
          fetchingEmojis={fetchingEmojis}
        />
      ))}
    </ul>
  );
};

export default QuoteList;
