import {
  Accordion,
  Button,
  Flex,
  Icon,
  Skeleton,
  Tooltip,
} from '@webkom/lego-bricks';
import cx from 'classnames';
import { sortBy } from 'lodash-es';
import {
  ChartNoAxesColumn,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Info,
} from 'lucide-react';
import moment from 'moment-timezone';
import EmptyState from '~/components/EmptyState';
import { votePoll } from '~/redux/actions/PollActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import styles from './Poll.module.css';

import type PollType from '~/redux/models/Poll';

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

  const now = moment();
  const isValid = moment(poll.validUntil).isAfter(now);

  const canAnswer = !hasAnswered && isValid;

  return (
    <Flex alignItems="center" className={styles.poll} column>
      <Flex
        column
        alignItems="center"
        justifyContent="center"
        className={styles.topBar}
      >
        <Icon iconNode={<ChartNoAxesColumn />} className={styles.pollIcon} />
        <a href={`/polls/${pollId}`} className={styles.titleLink}>
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
        </a>
      </Flex>
      <Accordion
        disabled={alwaysOpen}
        defaultOpen={alwaysOpen}
        triggerPosition="bottom"
        wrapperClassName={styles.contentWrapper}
        triggerComponent={({ onClick, disabled, open }) => (
          <Flex
            alignItems="center"
            justifyContent="center"
            className={cx(styles.bottomBar, open && styles.expanded)}
            style={{ cursor: !disabled ? 'pointer' : '' }}
            onClick={!disabled ? onClick : undefined}
          >
            {!alwaysOpen && (
              <Icon
                className={styles.arrowIcon}
                iconNode={open ? <ChevronUp /> : <ChevronDown />}
              />
            )}
          </Flex>
        )}
      >
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
          gap="var(--spacing-sm)"
          className={styles.registrationCount}
        >
          <span>
            <span className={styles.totalVotes}>{totalVotes}</span>{' '}
            {totalVotes === 1 ? 'stemme' : 'stemmer'}
          </span>
          <Tooltip content="Avstemningen er anonym">
            <Icon iconNode={<Info />} size={17} />
          </Tooltip>
        </Flex>
      </Accordion>
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
        <Flex key={option.id} width="90%">
          <Button
            className={styles.voteButton}
            dark
            onPress={() => dispatch(votePoll(poll.id, option.id))}
          >
            {option.name}
          </Button>
        </Flex>
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
                  <EmptyState body="Ingen stemmer" />
                ) : (
                  <Flex alignItems="center" className={styles.fullGraph}>
                    <div
                      style={{
                        width: `${ratio}%`,
                      }}
                    >
                      <Flex alignItems="center" className={styles.pollGraph}>
                        {ratio >= 18 && <span>{`${ratio}%`}</span>}
                      </Flex>
                    </div>
                    {ratio < 18 && (
                      <span className={styles.ratioOutsideBar}>
                        {`${ratio}%`}
                      </span>
                    )}
                  </Flex>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    {resultsHidden && (
      <div className="secondaryFontColor">
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
    <Flex justifyContent="center" alignItems="center" gap="var(--spacing-sm)">
      Du har svart
      <Icon iconNode={<CircleCheck />} size={20} className={styles.success} />
    </Flex>
    <div className="secondaryFontColor">Resultatet er skjult</div>
  </Flex>
);
