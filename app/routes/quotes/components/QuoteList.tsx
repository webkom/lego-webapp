import { useState } from 'react';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type QuoteType from 'app/store/models/Quote';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import Quote from './Quote';

type Props = {
  quotes: QuoteType[];
  approve: (id: ID) => Promise<void>;
  deleteQuote: (id: ID) => Promise<void>;
  unapprove: (id: ID) => Promise<void>;
  actionGrant: ActionGrant;
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
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
  emojis: Emoji[];
};

const QuoteList = ({
  quotes,
  actionGrant,
  approve,
  unapprove,
  deleteQuote,
  currentUser,
  loggedIn,
  addReaction,
  deleteReaction,
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
          approve={approve}
          unapprove={unapprove}
          deleteQuote={deleteQuote}
          quote={quote}
          key={quote.id}
          toggleDisplayAdmin={() =>
            setDisplayAdminId(
              quote.id === displayAdminId ? undefined : quote.id
            )
          }
          displayAdmin={quote.id === displayAdminId}
          currentUser={currentUser}
          loggedIn={loggedIn}
          addReaction={addReaction}
          deleteReaction={deleteReaction}
          emojis={emojis}
          fetchEmojis={fetchEmojis}
          fetchingEmojis={fetchingEmojis}
        />
      ))}
    </ul>
  );
};

export default QuoteList;
