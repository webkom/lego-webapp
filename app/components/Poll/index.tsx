import { Button, Card, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import Linkify from 'linkify-react';
import { sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { votePoll } from 'app/actions/PollActions';
import Tooltip from 'app/components/Tooltip';
import { useAppDispatch } from 'app/store/hooks';
import styles from './Poll.css';
import type { PollEntity, OptionEntity } from 'app/reducers/polls';

// As described in: https://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
export const perfectRatios = (
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

const optionsWithPerfectRatios = (options: Array<OptionEntity>) => {
  const totalVotes = options.reduce((a, option) => a + option.votes, 0);
  const ratios = options.map((option) => {
    return { ...option, ratio: (option.votes / totalVotes) * 100 };
  });
  return perfectRatios(ratios);
};

type Props = {
  poll: PollEntity;
  allowedToViewHiddenResults?: boolean;
  truncate?: number;
  details?: boolean;
};

type OptionEntityRatio = OptionEntity & {
  ratio: number;
};

const Poll = ({
  poll,
  allowedToViewHiddenResults,
  truncate,
  details,
}: Props) => {
  const [truncateOptions, setTruncateOptions] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const options = optionsWithPerfectRatios(poll.options);

    if (truncate && options.length > truncate) {
      setTruncateOptions(true);
      setExpanded(false);
    } else {
      setTruncateOptions(false);
      setExpanded(true);
    }
  }, [poll, truncate]);

  const toggleTruncate = () => {
    setExpanded(!expanded);
  };

  const dispatch = useAppDispatch();

  const { id, title, description, hasAnswered, totalVotes, resultsHidden } =
    poll;
  const options = optionsWithPerfectRatios(poll.options);
  const orderedOptions = options;
  const optionsToShow = expanded
    ? orderedOptions
    : orderedOptions.slice(0, truncate);
  const showResults = !resultsHidden || allowedToViewHiddenResults;

  return (
    <Card>
      <Flex column gap="1rem">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          className={styles.pollHeader}
        >
          <Link to={`/polls/${id}`}>
            <Flex alignItems="center" gap={10}>
              <Icon name="stats-chart" size={20} />
              <span className={styles.pollHeader}>{title}</span>
            </Flex>
          </Link>
          <Tooltip content="Avstemningen er anonym">
            <Icon name="information-circle-outline" size={20} />
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
          <Flex justifyContent="center" alignItems="center" gap={5}>
            Du har svart
            <Icon
              name="checkmark-circle-outline"
              size={20}
              className={styles.success}
            />
          </Flex>
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
                          <span className="secondaryFontColor">
                            Ingen stemmer
                          </span>
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
                className="secondaryFontColor"
                style={{
                  marginTop: 15,
                }}
              >
                Resultatet er skjult for vanlige brukere
              </p>
            )}
          </Flex>
        )}
        {!hasAnswered && (
          <Flex column className={styles.optionWrapper}>
            {!expanded && (
              <Flex
                alignItems="center"
                className={styles.blurContainer}
                onClick={toggleTruncate}
              >
                <p className={styles.blurOverlay}>
                  Klikk her for å se alle alternativene
                </p>
              </Flex>
            )}
            {options &&
              optionsToShow.map((option) => (
                <Flex
                  justifyContent="space-between"
                  style={{ flexGrow: '1' }}
                  className={cx(expanded ? '' : styles.blurEffect)}
                  key={option.id}
                >
                  <Button
                    dark
                    onClick={() => dispatch(votePoll(poll.id, option.id))}
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
                <Flex alignItems="center" justifyContent="center">
                  <Icon
                    onClick={toggleTruncate}
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                  />
                </Flex>
              )}
          </div>
          <Flex justifyContent="space-between">
            <span>
              <span className={styles.totalVotes}>{totalVotes}</span>{' '}
              {totalVotes === 1 ? 'stemme' : 'stemmer'}
            </span>
            {hasAnswered && !showResults && (
              <span className="secondaryFontColor">Resultatet er skjult</span>
            )}
          </Flex>
        </div>
      </Flex>
    </Card>
  );
};

export default Poll;
