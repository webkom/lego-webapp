import { Flex } from '@webkom/lego-bricks';
import { useRef, useState } from 'react';
import useListEntranceAnimation from '~/utils/useListEntranceAnimation';
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

  const listRef = useRef<HTMLElement>(null);
  useListEntranceAnimation(
    listRef,
    quotes
      .filter(Boolean)
      .map((quote) => quote.id)
      .join(),
  );

  return (
    <Flex column gap={'var(--spacing-lg)'} componentRef={listRef}>
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
    </Flex>
  );
};

export default QuoteList;
