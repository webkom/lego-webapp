import cx from 'classnames';
import { useRef, useEffect, useState } from 'react';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import { Flex } from 'app/components/Layout';
import LegoReactions from 'app/components/LegoReactions';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import type { ID } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { QuoteEntity } from 'app/reducers/quotes';
import styles from './RandomQuote.css';

type Props = {
  fetchRandomQuote: (arg0: Array<ID>) => Promise<void>;
  addReaction: (arg0: {
    emoji: string;
    contentTarget: string;
  }) => Promise<void>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
  emojis: Array<EmojiEntity>;
  currentQuote: QuoteEntity;
  loggedIn: boolean;
  useReactions?: boolean;
};

const RandomQuote = (props: Props) => {
  const {
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

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    const quoteId = props.currentQuote.id;

    if (!seenQuotes.current.includes(quoteId)) {
      seenQuotes.current = [...seenQuotes.current, quoteId];
    }
  });

  const onClick = () => {
    setAnimation(true);
    props.fetchRandomQuote(seenQuotes.current);
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
