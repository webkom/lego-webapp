// @flow

import React from 'react';
import Button from 'app/components/Button';
import styles from './Poll.css';
import type { PollEntity, OptionEntity } from 'app/reducers/polls';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';

type Props = {
  poll: PollEntity,
  handleVote: (pollId: number, optionId: number) => Promise<*>,
  backgroundLight?: boolean,
  truncate?: number,
  details?: boolean
};

type State = {
  truncateOptions: boolean,
  optionsToShow: Array<OptionEntity>,
  expanded: boolean
};

class Poll extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { options } = props.poll;
    if (props.truncate && options.length > props.truncate) {
      this.state = {
        truncateOptions: true,
        optionsToShow: options.slice(0, 3),
        expanded: false
      };
    } else if (!props.truncate) {
      this.state = {
        truncateOptions: false,
        optionsToShow: options,
        expanded: true
      };
    } else {
      this.state = {
        truncateOptions: false,
        optionsToShow: options,
        expanded: true
      };
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.poll.options !== this.props.poll.options) {
      this.props.truncate && !this.state.expanded
        ? this.setState({
            optionsToShow: this.props.poll.options.slice(0, this.props.truncate)
          })
        : this.setState({ optionsToShow: this.props.poll.options });
    }
  }

  render() {
    const { poll, handleVote, backgroundLight, details, truncate } = this.props;
    const { truncateOptions, optionsToShow, expanded } = this.state;
    const { id, title, description, options, hasAnswered, totalVotes } = poll;

    const toggleTruncate = () =>
      expanded
        ? this.setState({
            optionsToShow: options.slice(0, truncate),
            expanded: false
          })
        : this.setState({ optionsToShow: options, expanded: true });

    return (
      <div
        className={`${styles.poll} ${backgroundLight ? styles.pollLight : ''}`}
      >
        <Link to={`/polls/${id}`}>
          <Icon name="stats" />
          <span className={styles.pollHeader}>{title}</span>
        </Link>
        {details && (
          <div>
            <p>{description}</p>
          </div>
        )}
        {hasAnswered && (
          <div className={styles.answeredPoll}>
            <table className={styles.pollTable}>
              <tbody>
                {optionsToShow.map(option => (
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
              </tbody>
            </table>
          </div>
        )}
        {!hasAnswered && (
          <div>
            {options &&
              optionsToShow.map(option => (
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
        {truncateOptions && (
          <div className={styles.moreOptionsLink}>
            <Icon
              onClick={toggleTruncate}
              className={styles.arrow}
              size={20}
              name={expanded ? 'arrow-up' : 'arrow-down'}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Poll;
