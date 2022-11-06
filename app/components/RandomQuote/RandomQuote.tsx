import { useRef, useEffect } from 'react';
import styles from './RandomQuote.css';
import Button from '../Button';
import type { QuoteEntity } from 'app/store/slices/quotesSlice';
import LegoReactions from 'app/components/LegoReactions';
import type { EmojiEntity } from 'app/store/slices/emojisSlice';
import type { ID } from 'app/models';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { Flex } from 'app/components/Layout';
type Props = {
  fetchRandomQuote: (arg0: Array<ID>) => Promise<Record<string, any>>;
  className?: string;
  addReaction: (arg0: { emoji: string; contentTarget: string }) => Promise<any>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<any>;
  fetchEmojis: () => Promise<any>;
  fetchingEmojis: boolean;
  emojis: Array<EmojiEntity>;
  currentQuote: QuoteEntity;
  loggedIn: boolean;
  useReactions?: boolean;
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
