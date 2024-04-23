import { Button, Flex, Icon, Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { sortBy } from 'lodash';
import moment from 'moment-timezone';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { votePoll } from 'app/actions/PollActions';
import Tooltip from 'app/components/Tooltip';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './Poll.css';
import type PollType from 'app/store/models/Poll';

type PollOptionRatio = PollType['options'][0] & {
  ratio: number;
};

// As described in: https://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
export const perfectRatios = (
  options: ReadonlyArray<PollOptionRatio>,
): PollOptionRatio[] => {
  const off =
    100 - options.reduce((a, option) => a + Math.floor(option.ratio), 0);
  return sortBy<PollOptionRatio>(
    options,
    (o: PollOptionRatio) => Math.floor(o.ratio) - o.ratio,
  )
    .map((option: PollOptionRatio, index: number) => {
      return {
        ...option,
        ratio: Math.floor(option.ratio) + (index < off ? 1 : 0),
      };
    })
    .sort((a, b) => b.ratio - a.ratio);
};

const optionsWithPerfectRatios = (options: PollType['options']) => {
  const totalVotes = options.reduce((a, option) => a + option.votes, 0);
  const ratios = options.map((option) => {
    return { ...option, ratio: (option.votes / totalVotes) * 100 };
  });
  return perfectRatios(ratios);
};

type Props = {
  poll?: PollType;
  allowedToViewHiddenResults?: boolean;
  details?: boolean;
  alwaysOpen?: boolean;
};

const Poll = ({
  poll,
  allowedToViewHiddenResults,
  details,
  alwaysOpen = false,
}: Props) => {
  const optionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(alwaysOpen);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.polls.fetching,
  );

  if (fetching && !poll) {
    return <Skeleton className={styles.poll} />;
  }

  if (!poll) {
    return null;
  }

  const {
    id: pollId,
    title,
    description,
    hasAnswered,
    totalVotes,
    resultsHidden,
  } = poll;

  const options = optionsWithPerfectRatios(poll.options);
  const showResults = !resultsHidden || allowedToViewHiddenResults;
  const expandedHeight = optionRef.current?.clientHeight ?? 0;

  const now = moment();
  const isValid = moment(poll.validUntil).isAfter(now);

  const canAnswer = !hasAnswered && isValid;

  return (
    <Flex
      alignItems="center"
      className={cx(styles.poll, expanded ? styles.expanded : undefined)}
      column
    >
      <Flex
        alignItems="center"
        className={styles.topBar}
        column
        justifyContent="center"
      >
        <Icon
          name={hasAnswered ? 'stats-chart' : 'help'}
          size={28}
          className={styles.pollIcon}
        />
        <Link to={`/polls/${pollId}`} className={styles.titleLink}>
          <Flex
            alignItems="center"
            className={styles.title}
            justifyContent="center"
          >
            {!details && description.length !== 0 ? (
              <Tooltip content="Trykk for mer info">{title}</Tooltip>
            ) : (
              <>{title}</>
            )}
          </Flex>
        </Link>
      </Flex>
      <Flex
        column
        className={styles.contentWrapper}
        style={{
          height: alwaysOpen ? `auto` : expanded ? `${expandedHeight}px` : '0',
        }}
      >
        <div ref={optionRef}>
          {canAnswer && (
            <VoteOpen details={details} poll={poll} options={options} />
          )}
          {!canAnswer && showResults && (
            <VoteResults
              details={details}
              poll={poll}
              options={options}
              resultsHidden={resultsHidden}
            />
          )}
          {!canAnswer && !showResults && (
            <VoteHidden details={details} poll={poll} />
          )}

          <Flex
            alignItems="center"
            justifyContent="center"
            className={styles.registrationCount}
            gap={8}
          >
            <Tooltip content="Avstemningen er anonym.">
              <Icon name="information-circle-outline" size={17} />
            </Tooltip>
            <span>
              <span className={styles.totalVotes}>{totalVotes}</span>{' '}
              {totalVotes === 1 ? 'stemme' : 'stemmer'}
            </span>
          </Flex>
        </div>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        className={styles.bottomBar}
        style={{ cursor: alwaysOpen ? '' : 'pointer' }}
        onClick={alwaysOpen ? undefined : toggleExpanded}
      >
        {!alwaysOpen && (
          <Icon
            className={styles.arrowIcon}
            size={26}
            name={expanded ? 'chevron-up' : 'chevron-down'}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default Poll;

type VoteOpenProps = {
  poll: PollType;
  details?: boolean;
  options: PollOptionRatio[];
};

const VoteOpen = ({ details, poll, options }: VoteOpenProps) => {
  const dispatch = useAppDispatch();

  return (
    <Flex column alignItems="center" className={styles.optionWrapper}>
      {details && <p className={styles.description}>{poll.description}</p>}
      {options.map((option) => (
        <Button
          key={option.id}
          className={styles.voteButton}
          dark
          onClick={() => dispatch(votePoll(poll.id, option.id))}
        >
          {option.name}
        </Button>
      ))}
    </Flex>
  );
};

type VoteResultsProps = {
  poll: PollType;
  details?: boolean;
  options: PollOptionRatio[];
  resultsHidden: boolean;
};

const VoteResults = ({
  details,
  poll,
  options,
  resultsHidden,
}: VoteResultsProps) => (
  <Flex column className={styles.optionWrapper}>
    {details && <p className={styles.description}>{poll.description}</p>}
    <table className={styles.pollTable}>
      <tbody>
        {options.map(({ id, name, votes, ratio }) => {
          return (
            <tr key={id}>
              <td className={styles.textColumn}>{name}</td>
              <td className={styles.graphColumn}>
                {votes === 0 ? (
                  <span className="secondaryFontColor">Ingen stemmer</span>
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
      <div className={styles.resultsHiddenInfo}>
        Resultatet er skjult for vanlige brukere
      </div>
    )}
  </Flex>
);

type VoteHiddenProps = {
  poll: PollType;
  details?: boolean;
};

const VoteHidden = ({ details, poll }: VoteHiddenProps) => (
  <Flex column alignItems="center" className={styles.voteOptions}>
    {details && <p className={styles.description}>{poll.description}</p>}
    <Flex justifyContent="center" alignItems="center" gap={5}>
      Du har svart
      <Icon
        name="checkmark-circle-outline"
        size={20}
        className={styles.success}
      />
    </Flex>
    <div className={styles.resultsHiddenInfo}>Resultatet er skjult</div>
  </Flex>
);
