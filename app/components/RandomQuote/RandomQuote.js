// @flow

import React from 'react';
import styles from './RandomQuote.css';
import Button from '../Button';
import type { QuoteEntity } from 'app/reducers/quotes';
import LegoReactions from 'app/components/LegoReactions';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { ID } from 'app/models';
import { Link } from 'react-router';
import { Flex } from 'app/components/Layout';

type Props = {
  fetchRandomQuote: () => Promise<Object>,
  loggedIn: boolean,
  className?: string,
  addReaction: ({
    emoji: string,
    contentTarget: string
  }) => Promise<*>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  fetchEmojis: () => Promise<*>,
  fetchingEmojis: boolean,
  emojis: Array<EmojiEntity>,
  currentQuote: QuoteEntity
};

const RandomQuote = (props: Props) => {
  const {
    loggedIn,
    className,
    addReaction,
    deleteReaction,
    emojis,
    fetchEmojis,
    fetchingEmojis,
    currentQuote
  } = props;

  if (!loggedIn) {
    return <div>Logg inn for å se sitater.</div>;
  }

  return (
    <div className={className ? className : ''}>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Flex column>
          <div className={styles.quoteText}>{currentQuote.text}</div>
          <div className={styles.quoteSource}>-{currentQuote.source}</div>
        </Flex>

        <Flex column justifyContent="space-between" className={styles.actions}>
          <Button flat onClick={() => props.fetchRandomQuote()}>
            <i className="fa fa-refresh" />
          </Button>
          <Link to="/quotes/add" className={styles.add}>
            <i className="fa fa-plus" />
          </Link>
        </Flex>
      </Flex>

      <div className={styles.quoteReactions}>
        <LegoReactions
          emojis={emojis}
          fetchEmojis={fetchEmojis}
          fetchingEmojis={fetchingEmojis}
          addReaction={addReaction}
          deleteReaction={deleteReaction}
          parentEntity={currentQuote}
        />
      </div>
    </div>
  );
};

export default RandomQuote;
