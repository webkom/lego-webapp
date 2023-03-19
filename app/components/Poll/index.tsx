import cx from 'classnames';
import Linkify from 'linkify-react';
import { sortBy } from 'lodash';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import type { PollEntity, OptionEntity } from 'app/reducers/polls';
import styles from './Poll.css';

type Props = {
  poll: PollEntity;
  handleVote: (pollId: number, optionId: number) => Promise<void>;
  allowedToViewHiddenResults?: boolean;
  truncate?: number;
  details?: boolean;
};
type OptionEntityRatio = OptionEntity & {
  ratio: number;
};
type State = {
  truncateOptions: boolean;
  shuffledOptions: Array<OptionEntityRatio>;
  expanded: boolean;
};

class Poll extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const options = this.optionsWithPerfectRatios(props.poll.options);
    const shuffledOptions = this.shuffle(options);

    if (props.truncate && options.length > props.truncate) {
      this.state = {
        truncateOptions: true,
        shuffledOptions: shuffledOptions,
        expanded: false,
      };
    } else {
      this.state = {
        truncateOptions: false,
        shuffledOptions: shuffledOptions,
        expanded: true,
      };
    }
  }

  toggleTruncate = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };
  optionsWithPerfectRatios = (options: Array<OptionEntity>) => {
    const totalVotes = options.reduce((a, option) => a + option.votes, 0);
    const ratios = options.map((option) => {
      return { ...option, ratio: (option.votes / totalVotes) * 100 };
    });
    return this.perfectRatios(ratios);
  };
  // As described in: https://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
  perfectRatios = (
    options: ReadonlyArray<OptionEntityRatio>
  ): OptionEntityRatio[] => {
    const off =
      100 - options.reduce((a, option) => a + Math.floor(option.ratio), 0);
    return sortBy<OptionEntityRatio>(
      options,
      (o: OptionEntityRatio) => Math.floor(o.ratio) - o.ratio
    )
      .map((option: OptionEntityRatio, index: number) => {
        return {
          ...option,
          ratio: Math.floor(option.ratio) + (index < off ? 1 : 0),
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
    const { poll, handleVote, details, truncate, allowedToViewHiddenResults } =
      this.props;
    const { truncateOptions, expanded, shuffledOptions } = this.state;
    const { id, title, description, hasAnswered, totalVotes, resultsHidden } =
      poll;
    const options = this.optionsWithPerfectRatios(this.props.poll.options);
    // Random ordering breaks SSR
    //const orderedOptions = hasAnswered ? options : shuffledOptions;
    const orderedOptions = options;
    const optionsToShow = expanded
      ? orderedOptions
      : orderedOptions.slice(0, truncate);
    const showResults = !resultsHidden || allowedToViewHiddenResults;
    return (
      <Card>
        <Flex justifyContent="space-between">
          <Link to={`/polls/${id}`}>
            <Flex gap={10}>
              <Icon name="stats-chart" />
              <span className={styles.pollHeader}>{title}</span>
            </Flex>
          </Link>
          <Tooltip content="Avstemningen er anonym." renderDirection="left">
            <Flex>
              <Icon
                name="information-circle-outline"
                size={20}
                style={{
                  cursor: 'pointer',
                }}
              />
            </Flex>
          </Tooltip>
        </Flex>
        {details && (
          <div>
            <Linkify
              tagName="p"
              options={{
                rel: 'noopener noreferrer',
                attributes: {
                  target: '_blank',
                },
              }}
            >
              {description}
            </Linkify>
          </div>
        )}
        {hasAnswered && !showResults && (
          <div className={styles.answered}>
            Du har svart
            <Icon
              name="checkmark-circle-outline"
              size={20}
              style={{
                marginLeft: '10px',
                color: 'var(--color-green-6)',
              }}
            />
          </div>
        )}
        {hasAnswered && showResults && (
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
                                width: `${ratio}%`,
                              }}
                            >
                              <div className={styles.pollGraph}>
                                {ratio >= 18 && <span>{`${ratio}%`}</span>}
                              </div>
                            </div>
                            {ratio < 18 && (
                              <span
                                style={{
                                  padding: '5px',
                                  marginLeft: '2px',
                                }}
                              >
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
            {resultsHidden && (
              <p
                style={{
                  fontStyle: 'italic',
                  marginTop: 15,
                }}
              >
                Resultatet er skjult for vanlige brukere.
              </p>
            )}
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
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={60}
                  className={cx(styles.blurOverlay, styles.blurArrow)}
                />
              </Flex>
            )}
            {options &&
              optionsToShow.map((option) => (
                <Flex
                  className={cx(
                    styles.alignItems,
                    expanded ? '' : styles.blurEffect
                  )}
                  key={option.id}
                >
                  <Button
                    dark
                    onClick={() => handleVote(poll.id, option.id)}
                    className={styles.voteButton}
                  >
                    {option.name}
                  </Button>
                </Flex>
              ))}
          </Flex>
        )}
        <div>
          <div className={styles.moreOptionsLink}>
            {truncateOptions &&
              (!hasAnswered ||
                !resultsHidden ||
                allowedToViewHiddenResults) && (
                <div className={styles.alignItems}>
                  <Icon
                    onClick={this.toggleTruncate}
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    className={styles.arrow}
                  />
                </div>
              )}
          </div>
          <div className={styles.bottomInfo}>
            <span>{`Stemmer: ${totalVotes}`}</span>
            {hasAnswered && !showResults && (
              <span className={styles.resultsHidden}>
                Resultatet er skjult.
              </span>
            )}
          </div>
        </div>
      </Card>
    );
  }
}

export default Poll;
