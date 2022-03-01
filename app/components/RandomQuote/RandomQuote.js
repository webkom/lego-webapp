// @flow

// $FlowFixMe
import { useRef, useEffect } from 'react';
import styles from './RandomQuote.css';
import Button from '../Button';
import type { QuoteEntity } from 'app/reducers/quotes';
import LegoReactions from 'app/components/LegoReactions';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { ID } from 'app/models';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

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

  const BubbleArrow = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="73"
        height="51"
        fill="none"
        viewBox="0 0 73 51"
        className={styles.bubbleArrow}
      >
        <path
          fill="currentColor"
          d="M0 51c5.476-3.796 14.338-19.31 3.983-51 20.412.99 63.925 5.546 68.705 15.845C77.468 26.144 26.22 43.573 0 51z"
        ></path>
      </svg>
    );
  };

  return (
    <div className={className ? className : ''}>
      <BubbleArrow />
      <Flex
        column
        alignItems="flex-start"
        justifyContent="space-between"
        style={{ width: '100%', height: '100%' }}
      >
        <Link to={`/quotes/${currentQuote.id}`}>
          <div className={styles.quoteText}>{currentQuote.text}</div>
          <div className={styles.quoteSource}>-{currentQuote.source}</div>
        </Link>
        <Flex justifyContent="space-between" style={{ width: '100%' }}>
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
          <Flex
            justifyContent="space-between"
            alignItems="flex-end"
            className={styles.actions}
          >
            <Button
              flat
              onClick={() => props.fetchRandomQuote(seenQuotes.current)}
            >
              <i className="fa fa-refresh" />
            </Button>
            <Link to="/quotes/add">
              <i className="fa fa-plus" />
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default RandomQuote;
