// @flow

import React, { Component } from 'react';
import styles from './RandomQuote.css';
import Button from '../Button';
import type { QuoteEntity } from 'app/reducers/quotes';
import Reaction from 'app/components/Reactions/Reaction';
import Reactions from 'app/components/Reactions';
import type { EmojiEntity } from 'app/reducers/emojis';

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

class RandomQuote extends Component<Props> {
  render() {
    const {
      loggedIn,
      className,
      addReaction,
      deleteReaction,
      emojis,
      fetchEmojis,
      fetchingEmojis,
      currentQuote
    } = this.props;

    if (!currentQuote.reactionsGrouped || !emojis) {
      return <div />;
    }

    let mappedEmojis = [];
    if (!fetchingEmojis) {
      mappedEmojis = emojis.map(emoji => {
        const foundReaction = !currentQuote.reactionsGrouped
          ? undefined
          : currentQuote.reactionsGrouped.find(
              reaction =>
                emoji.shortCode == reaction.emoji && reaction.hasReacted
            );
        if (foundReaction !== undefined) {
          emoji.hasReacted = true;
          emoji.reactionId = foundReaction.reactionId;
        } else {
          emoji.hasReacted = false;
          emoji.reactionId = -1;
        }
        return emoji;
      });
    }

    return loggedIn ? (
      <div className={className ? className : ''}>
        <div className={styles.textContainer}>
          <div className={styles.quoteText}>{currentQuote.text}</div>
          <Button
            flat
            onClick={() => this.props.fetchRandomQuote()}
            className={styles.refresh}
          >
            <i className="fa fa-refresh" />
          </Button>
        </div>
        <div className={styles.quoteSource}>-{currentQuote.source}</div>

        <div className={styles.quoteReactions}>
          <Reactions
            emojis={mappedEmojis}
            fetchEmojis={fetchEmojis}
            fetchingEmojis={fetchingEmojis}
            addReaction={addReaction}
            deleteReaction={deleteReaction}
            contentTarget={currentQuote.contentTarget}
          >
            {currentQuote.reactionsGrouped.map(reaction => {
              return (
                <Reaction
                  key={`reaction-${reaction.emoji}`}
                  emoji={reaction.emoji}
                  count={reaction.count}
                  unicodeString={reaction.unicodeString}
                  reactionId={reaction.reactionId}
                  hasReacted={reaction.hasReacted}
                  addReaction={addReaction}
                  deleteReaction={deleteReaction}
                  contentTarget={currentQuote.contentTarget}
                />
              );
            })}
          </Reactions>
        </div>
      </div>
    ) : (
      'Logg inn for å se sitater.'
    );
  }
}

export default RandomQuote;
