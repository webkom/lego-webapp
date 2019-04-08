// @flow

import React from 'react';
import Button from 'app/components/Button';
import styles from './Poll.css';
import type { PollEntity, OptionEntity } from 'app/reducers/polls';
import { sortBy } from 'lodash';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import cx from 'classnames';

type Props = {
  poll: PollEntity,
  handleVote: (pollId: number, optionId: number) => Promise<*>,
  backgroundLight?: boolean,
  truncate?: number,
  details?: boolean
};

type State = {
  truncateOptions: boolean,
  shuffledOptions: Array<OptionEntityRatio>,
  expanded: boolean
};

type OptionEntityRatio = OptionEntity & {
  ratio: number
};

class Poll extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const options = this.optionsWithPerfectRatios(props.poll.options);
    const shuffledOptions = this.shuffle(options);
    if (props.truncate && options.length > props.truncate) {
      this.state = {
        truncateOptions: true,
        shuffledOptions: shuffledOptions,
        expanded: false
      };
    } else {
      this.state = {
        truncateOptions: false,
        shuffledOptions: shuffledOptions,
        expanded: true
      };
    }
  }

  toggleTruncate = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  };

  optionsWithPerfectRatios = (options: Array<OptionEntity>) => {
    const totalVotes = options.reduce((a, option) => a + option.votes, 0);
    const ratios = options.map(option => {
      return { ...option, ratio: (option.votes / totalVotes) * 100 };
    });
    return this.perfectRatios(ratios);
  };

  // As described in: https://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
  perfectRatios = (options: Array<OptionEntityRatio>) => {
    const off =
      100 - options.reduce((a, option) => a + Math.floor(option.ratio), 0);
    return sortBy(options, o => Math.floor(o.ratio) - o.ratio)
      .map((option, index) => {
        return {
          ...option,
          ratio: Math.floor(option.ratio) + (index < off ? 1 : 0)
        };
      })
      .sort((a, b) => b.ratio - a.ratio);
  };

  shuffle = (array: Array<OptionEntityRatio>) => {
    const oldArray = array.slice(0);
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      const randIndex = Math.floor(Math.random() * oldArray.length);
      newArray[i] = oldArray[randIndex];
      oldArray.splice(randIndex, 1);
    }

    return newArray;
  };

  render() {
    const { poll, handleVote, backgroundLight, details, truncate } = this.props;
    const { truncateOptions, expanded, shuffledOptions } = this.state;
    const { id, title, description, hasAnswered, totalVotes } = poll;
    const options = this.optionsWithPerfectRatios(this.props.poll.options);
    const orderedOptions = hasAnswered ? options : shuffledOptions;
    const optionsToShow = expanded
      ? orderedOptions
      : orderedOptions.slice(0, truncate);
    return (
      <div className={cx(styles.poll, backgroundLight ? styles.pollLight : '')}>
        <Flex>
          <Link to={`/polls/${id}`} style={{ flex: 1 }}>
            <Icon name="stats" />
            <span className={styles.pollHeader}>{title}</span>
          </Link>
          <Tooltip content="Avstemningen er anonym." renderDirection="left">
            <Icon
              name="information-circle-outline"
              size={20}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        </Flex>
        {details && (
          <div>
            <p>{description}</p>
          </div>
        )}
        {hasAnswered && (
          <Flex column className={styles.optionWrapper}>
            <table className={styles.pollTable}>
              <tbody>
                {optionsToShow.map(({ id, name, votes, ratio }) => {
                  return (
                    <tr key={id}>
                      <td className={styles.textColumn}>{name}</td>
                      <td className={styles.graphColumn}>
                        {votes === 0 ? (
                          <span className={styles.noVotes}>Ingen stemmer</span>
                        ) : (
                          <div className={styles.fullGraph}>
                            <div
                              style={{
                                width: `${ratio}%`
                              }}
                            >
                              <div className={styles.pollGraph}>
                                {ratio >= 18 && <span>{`${ratio}%`}</span>}
                              </div>
                            </div>
                            {ratio < 18 && (
                              <span style={{ marginLeft: '2px' }}>
                                {`${ratio}%`}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Flex>
        )}
        {!hasAnswered && (
          <Flex column className={styles.optionWrapper}>
            {!expanded && (
              <Flex
                className={styles.blurContainer}
                onClick={this.toggleTruncate}
              >
                <p className={styles.blurOverlay}>
                  Klikk her for å se alle alternativene.
                </p>
                <Icon
                  className={cx(styles.blurOverlay, styles.blurArrow)}
                  size={60}
                  name={expanded ? 'arrow-up' : 'arrow-down'}
                />
              </Flex>
            )}
            {options &&
              optionsToShow.map(option => (
                <Flex
                  className={cx(
                    styles.alignItems,
                    expanded ? '' : styles.blurEffect
                  )}
                  key={option.id}
                >
                  <Button
                    className={styles.voteButton}
                    onClick={() => handleVote(poll.id, option.id)}
                  >
                    {option.name}
                  </Button>
                </Flex>
              ))}
          </Flex>
        )}
        <div style={{ height: '29px' }}>
          <div className={styles.moreOptionsLink}>
            <span>{`Stemmer: ${totalVotes}`}</span>
            {truncateOptions && (
              <div className={styles.alignItems}>
                <Icon
                  onClick={this.toggleTruncate}
                  className={styles.arrow}
                  size={20}
                  name={expanded ? 'arrow-up' : 'arrow-down'}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Poll;
