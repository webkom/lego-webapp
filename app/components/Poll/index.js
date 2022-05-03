// @flow

import { useEffect, useRef, useState } from 'react';
import Button from 'app/components/Button';
import styles from './Poll.css';
import type { PollEntity, OptionEntity } from 'app/reducers/polls';
import { sortBy } from 'lodash';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import moment from 'moment-timezone';

type Props = {
  poll: PollEntity,
  handleVote: (pollId: number, optionId: number) => Promise<*>,
  allowedToViewHiddenResults?: boolean,
  details?: boolean,
  expanded?: boolean,
  alwaysOpen?: boolean,
};

type OptionEntityRatio = OptionEntity & {
  ratio: number,
};

// As described in: https://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
export const perfectRatios = (
  options: $ReadOnlyArray<OptionEntityRatio>
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

const shuffle = (array: Array<OptionEntityRatio>) => {
  const oldArray = array.slice(0);
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    const randIndex = Math.floor(Math.random() * oldArray.length);
    newArray[i] = oldArray[randIndex];
    oldArray.splice(randIndex, 1);
  }

  return newArray;
};

const Poll = ({
  poll,
  handleVote,
  details,
  allowedToViewHiddenResults,
  alwaysOpen = false,
  expanded = false,
}: Props) => {
  const { id, title, description, hasAnswered, totalVotes, resultsHidden } =
    poll;
  const optionRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded || alwaysOpen);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [optionsToShow, setOptionsToShow] = useState([]);

  useEffect(() => {
    if (optionRef.current !== null)
      setExpandedHeight(optionRef.current.clientHeight);

    const options = optionsWithPerfectRatios(poll.options);
    setOptionsToShow(hasAnswered ? options : shuffle(options));
  }, [expandedHeight, hasAnswered, optionRef, poll.options]);

  const toggleTruncate = () => {
    setIsExpanded(!isExpanded);
  };

  const now = moment();
  const isValid = moment(poll.validUntil).isAfter(now);

  const canAnswer = !hasAnswered && isValid;
  const hideResults = resultsHidden && !allowedToViewHiddenResults;

  return (
    <Flex alignItems="center" column className={styles.poll}>
      <Flex
        justifyContent="center"
        className={styles.topBar}
        alignItems="center"
      >
        <Icon
          name={hasAnswered ? 'stats' : 'help'}
          prefix="ion-md-"
          className={styles.pollIcon}
          size={32}
        />

        <Link to={`/polls/${id}`}>
          <Flex
            justifyContent="center"
            alignItems="center"
            className={styles.headerBar}
          >
            {!details && description.length !== 0 ? (
              <Tooltip content="Trykk for mer info" renderDirection="right">
                {title}
              </Tooltip>
            ) : (
              <> {title} </>
            )}
          </Flex>
        </Link>
      </Flex>
      <Flex
        column
        alignItems="center"
        className={styles.contentWrapper}
        style={{
          height: alwaysOpen
            ? `auto`
            : isExpanded
            ? `${expandedHeight}px`
            : '0',
        }}
      >
        <div className={styles.voteOptionsWrapper} ref={optionRef}>
          {canAnswer && (
            <Flex column alignItems="center" className={styles.voteOptions}>
              {details && description}
              {optionsToShow.map((option) => (
                <Button
                  key={option.id}
                  className={styles.voteButton}
                  onClick={() => handleVote(poll.id, option.id)}
                >
                  {option.name}
                </Button>
              ))}
            </Flex>
          )}
          {!canAnswer && hideResults && (
            <Flex column alignItems="center" className={styles.voteOptions}>
              {details && description}
              <div className={styles.resultsHiddenInfo}>
                Resultatet er skjult
              </div>
            </Flex>
          )}
          {!canAnswer && !hideResults && (
            <Flex column alignItems="center" className={styles.voteOptions}>
              {details && description}
              <table className={styles.pollTable}>
                <tbody>
                  {optionsToShow.map(({ id, name, votes, ratio }) => {
                    return (
                      <tr key={id}>
                        <td className={styles.textColumn}>{name}</td>
                        <td className={styles.graphColumn}>
                          {votes === 0 ? (
                            <span className={styles.noVotes}>
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
                                <span className={styles.outerGraphText}>
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
          <Flex column alignItems="center">
            <Flex>
              <Tooltip
                content="Avstemningen er anonym."
                renderDirection="right"
              >
                <Icon
                  name="information-circle-outline"
                  size={17}
                  style={{ cursor: 'pointer', margin: '0 5px' }}
                />
              </Tooltip>
              Stemmer: {totalVotes}
            </Flex>
            {resultsHidden && (
              <div className={styles.resultsHiddenInfo}>
                Resultatet er skjult for vanlige brukere.
              </div>
            )}
          </Flex>
        </div>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        className={isExpanded ? styles.bottomBarExpanded : styles.bottomBar}
        style={{ cursor: !alwaysOpen ? 'pointer' : null }}
        onClick={!alwaysOpen ? toggleTruncate : null}
      >
        {!alwaysOpen && (
          <Icon
            className={styles.arrowIcon}
            size={30}
            name={isExpanded ? 'arrow-up' : 'arrow-down'}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default Poll;
