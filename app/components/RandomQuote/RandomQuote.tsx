import { Card, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useRef, useEffect, useState } from 'react';
import LegoReactions from 'app/components/LegoReactions';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type Quote from 'app/store/models/Quote';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import styles from './RandomQuote.css';

type Props = {
  fetchRandomQuote: (seen: ID[]) => Promise<void>;
  addReaction: (args: {
    emoji: string;
    contentTarget: ContentTarget;
    unicodeString: string;
  }) => Promise<void>;
  deleteReaction: (args: {
    reactionId: ID;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
  emojis: Emoji[];
  currentQuote: Quote;
  loggedIn: boolean;
  useReactions?: boolean;
};

const RandomQuote = ({
  fetchRandomQuote,
  addReaction,
  deleteReaction,
  emojis,
  fetchEmojis,
  fetchingEmojis,
  currentQuote,
  loggedIn,
  useReactions = true,
}: Props) => {
  const seenQuotes = useRef([]);

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    const quoteId = currentQuote.id;

    if (!seenQuotes.current.includes(quoteId)) {
      seenQuotes.current = [...seenQuotes.current, quoteId];
    }
  });

  const onClick = () => {
    setAnimation(true);
    fetchRandomQuote(seenQuotes.current);
    setTimeout(() => setAnimation(false), 1000);
  };

  return (
    <Card>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Flex column className={styles.content}>
          <div className={styles.quoteText}>{currentQuote.text}</div>
          <div className={styles.quoteSource}>- {currentQuote.source}</div>
        </Flex>

        <Flex column justifyContent="space-between" gap={5}>
          <Icon
            name="refresh"
            onClick={onClick}
            className={cx(animation && styles.rotateIcon)}
          />
          <Icon to="/quotes/add" name="add" />
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
    </Card>
  );
};

export default RandomQuote;
