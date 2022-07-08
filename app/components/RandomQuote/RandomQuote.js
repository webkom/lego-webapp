// @flow

// $FlowFixMe
import { useEffect, useRef } from 'react';

import { Flex } from 'app/components/Layout';
import LegoReactions from 'app/components/LegoReactions';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import type { ID } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { QuoteEntity } from 'app/reducers/quotes';
import Button from '../Button';

import styles from './RandomQuote.css';

type Props = {
  fetchRandomQuote: (Array<ID>) => Promise<Object>,
  className?: string,
  addReaction: ({
    emoji: string,
    contentTarget: string,
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  fetchEmojis: () => Promise<*>,
  fetchingEmojis: boolean,
  emojis: Array<EmojiEntity>,
  currentQuote: QuoteEntity,
  loggedIn: boolean,
  useReactions?: boolean,
};

const RandomQuote = (props: Props) => {
  const {
    className,
    addReaction,
    deleteReaction,
    emojis,
    fetchEmojis,
    fetchingEmojis,
    currentQuote,
    loggedIn,
    useReactions = true,
  } = props;

  const seenQuotes = useRef([]);

  useEffect(() => {
    const quoteId = props.currentQuote.id;
    if (!seenQuotes.current.includes(quoteId)) {
      seenQuotes.current = [...seenQuotes.current, quoteId];
    }
  });

  return (
    <div className={className ? className : ''}>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Flex column>
          <div className={styles.quoteText}>{currentQuote.text}</div>
          <div className={styles.quoteSource}>-{currentQuote.source}</div>
        </Flex>

        <Flex column justifyContent="space-between" className={styles.actions}>
          <Button
            flat
            onClick={() => props.fetchRandomQuote(seenQuotes.current)}
            className={styles.fetchNew}
          >
            <i className="fa fa-refresh" />
          </Button>
          <NavigationLink to="/quotes/add">
            <i className="fa fa-plus" />
          </NavigationLink>
        </Flex>
      </Flex>

      {useReactions && (
        <div className={styles.quoteReactions}>
          <LegoReactions
            emojis={emojis}
            fetchEmojis={fetchEmojis}
            fetchingEmojis={fetchingEmojis}
            addReaction={addReaction}
            deleteReaction={deleteReaction}
            parentEntity={currentQuote}
            loggedIn={loggedIn}
          />
        </div>
      )}
    </div>
  );
};

export default RandomQuote;
