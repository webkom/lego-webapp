import cx from 'classnames';
import { useRef, useEffect, useState } from 'react';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import { Flex } from 'app/components/Layout';
import LegoReactions from 'app/components/LegoReactions';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
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

        <Flex column justifyContent="space-between" className={styles.actions}>
          <Button flat onClick={onClick} className={styles.fetchNew}>
            <i
              className={cx(['fa fa-refresh', animation && styles.rotateIcon])}
            />
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
    </Card>
  );
};

export default RandomQuote;
