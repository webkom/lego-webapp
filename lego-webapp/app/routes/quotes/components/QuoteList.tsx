import { useState } from 'react';
import Quote from './Quote';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type QuoteType from '~/redux/models/Quote';

type Props = {
  quotes: QuoteType[];
  actionGrant: ActionGrant;
};

const QuoteList = ({ quotes, actionGrant }: Props) => {
  const [displayAdminId, setDisplayAdminId] = useState<EntityId>();

  return (
    <ul>
      {quotes.filter(Boolean).map((quote) => (
        <Quote
          actionGrant={actionGrant}
          quote={quote}
          key={quote.id}
          toggleDisplayAdmin={() =>
            setDisplayAdminId(
              quote.id === displayAdminId ? undefined : quote.id,
            )
          }
          displayAdmin={quote.id === displayAdminId}
        />
      ))}
    </ul>
  );
};

export default QuoteList;
