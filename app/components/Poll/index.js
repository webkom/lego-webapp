// @flow

import React from 'react';
import Button from 'app/components/Button';
import styles from './Poll.css';
import type PollEntity from 'app/reducers/polls';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';

type props = {
  poll: PollEntity,
  handleVote: () => Promise<*>,
  backgroundLight: boolean
};

const Poll = (props: props) => {
  const { poll, handleVote, backgroundLight } = props;
  const { id, options, title, hasAnswered, totalVotes } = poll;
  if (hasAnswered == undefined) {
    return;
  }
  return (
    <div
      className={`${styles.poll} ${backgroundLight ? styles.pollLight : ''}`}
    >
      <Link to={`/polls/${id}`}>
        <Icon name="question" />
        <span className={styles.pollHeader}>{title}</span>
      </Link>
      {hasAnswered && (
        <div className={styles.answeredPoll}>
          <table className={styles.pollTable}>
            {options.map(option => (
              <tr key={option.id}>
                <td className={styles.textColumn}>{option.name}</td>
                <td className={styles.graphColumn}>
                  {option.votes !== 0 ? (
                    <div className={styles.fullGraph}>
                      <div
                        style={{
                          width: `${Math.round(
                            (option.votes / totalVotes) * 100
                          )}%`
                        }}
                      >
                        <div className={styles.pollGraph}>
                          <span>
                            {Math.floor((option.votes / totalVotes) * 100) +
                              '%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className={styles.noVotes}>Ingen stemmer</span>
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
      {!hasAnswered && (
        <div>
          {options &&
            options.map(option => (
              <Button
                key={option.id}
                className={styles.voteButton}
                onClick={() => handleVote(poll.id, option.id)}
              >
                {option.name}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
};

export default Poll;
