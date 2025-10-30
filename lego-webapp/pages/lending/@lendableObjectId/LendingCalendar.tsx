import { EntityId } from '@reduxjs/toolkit';
import { Button, Flex, Icon, Tooltip } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import moment, { Moment } from 'moment-timezone';
import { useState } from 'react';
import {
  fetchLendableObjectAvailability,
  fetchLendableObjectById,
} from '~/redux/actions/LendableObjectActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectLendableObjectById } from '~/redux/slices/lendableObjects';
import createMonthlyCalendar from '~/utils/createMonthlyCalendar';
import styles from './LendingCalendar.module.css';
import type { Dateish } from 'app/models';

type LendingCalendarProps = {
  lendableObjectId: EntityId;
  selectedRange?: [Dateish, Dateish];
};

type TimeRange = {
  start: string;
  end: string;
  fullDay: boolean;
};

type TimeRangeWithUser = {
  start: string;
  end: string;
  fullDay: boolean;
  userDisplayName: string;
  userName: string;
};

const LendingCalendar = ({
  lendableObjectId,
  selectedRange,
}: LendingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(moment());

  const dispatch = useAppDispatch();

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendableObjectId),
  );

  usePreparedEffect(
    'fetchLendingCalendar',
    async () => {
      if (!lendableObject) {
        await dispatch(fetchLendableObjectById(lendableObjectId));
      }

      return dispatch(
        fetchLendableObjectAvailability(lendableObjectId, {
          year: currentMonth.year(),
          month: currentMonth.month() + 1,
        }),
      );
    },
    [lendableObjectId, currentMonth],
  );

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(
      currentMonth.clone().add(direction === 'next' ? 1 : -1, 'month'),
    );
  };

  const getUnavailableTimeRanges = (
    selected: TimeRange | null,
    day: Moment,
  ): TimeRangeWithUser[] => {
    const dayStart = day.clone().startOf('day');
    const dayEnd = day.clone().endOf('day');
    const timeRanges: TimeRangeWithUser[] = [];

    if (!lendableObject?.availability) {
      return [];
    }

    for (const [
      start,
      end,
      userDisplayName,
      userName,
    ] of lendableObject.availability) {
      if (!start || !end) continue;

      const startDate = moment(start);
      const endDate = moment(end);

      if (startDate.isSameOrBefore(dayEnd) && endDate.isSameOrAfter(dayStart)) {
        const overlapStart = moment.max(startDate, dayStart);
        const overlapEnd = moment.min(endDate, dayEnd);

        const newTimeRange = {
          start: overlapStart.format('HH:mm'),
          end: overlapEnd.format('HH:mm'),
          fullDay:
            overlapStart.format('HH:mm') === '00:00' &&
            overlapEnd.format('HH:mm') === '23:59',
          userDisplayName: userDisplayName || 'Ukjent bruker',
          userName: userName || '',
        };

        const isSimilarToSelected =
          selected &&
          selected.start === newTimeRange.start &&
          selected.end === newTimeRange.end;

        if (!isSimilarToSelected) {
          timeRanges.push(newTimeRange);
        }
      }
    }

    return timeRanges;
  };

  const getSelectedTimeRange = (day: Moment) => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) return null;

    const dayStart = day.clone().startOf('day');
    const dayEnd = day.clone().endOf('day');

    const startDate = moment(selectedRange[0]);
    const endDate = moment(selectedRange[1]);

    if (startDate.isSameOrBefore(dayEnd) && endDate.isSameOrAfter(dayStart)) {
      const overlapStart = moment.max(startDate, dayStart);
      const overlapEnd = moment.min(endDate, dayEnd);

      return {
        start: overlapStart.format('HH:mm'),
        end: overlapEnd.format('HH:mm'),
        fullDay:
          overlapStart.format('HH:mm') === '00:00' &&
          overlapEnd.format('HH:mm') === '23:59',
      };
    }

    return null;
  };

  const isFullyUnavailable = (day: Moment) => {
    const dayStart = day.clone().startOf('day');
    const dayEnd = day.clone().endOf('day');

    if (!lendableObject?.availability) {
      return false;
    }

    for (const [start, end] of lendableObject.availability) {
      if (!start || !end) continue;
      const startDate = moment(start);
      const endDate = moment(end);

      if (startDate.isSameOrBefore(dayStart) && endDate.isSameOrAfter(dayEnd)) {
        return true;
      }
    }

    return false;
  };

  const getFullAvailableLender = (day: Moment) => {
    const dayStart = day.clone().startOf('day');
    const dayEnd = day.clone().endOf('day');

    if (!lendableObject?.availability) {
      return false;
    }

    for (const [
      start,
      end,
      userDisplayName,
      userName,
    ] of lendableObject.availability) {
      if (!start || !end) continue;
      const startDate = moment(start);
      const endDate = moment(end);

      if (startDate.isSameOrBefore(dayStart) && endDate.isSameOrAfter(dayEnd)) {
        return [userDisplayName, userName];
      }
    }

    return null;
  };

  const isInSelectedRange = (day: Moment) => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) return false;
    const [start, end] = selectedRange.map((d) => moment(d));
    return day.isBetween(start, end, 'day', '[]');
  };

  const isSelectedEndpoint = (day: Moment) => {
    if (!selectedRange || !selectedRange[0] || !selectedRange[1]) return false;
    const [start, end] = selectedRange.map((d) => moment(d));
    return day.isSame(start, 'day') || day.isSame(end, 'day');
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <h3>Tilgjengelighet</h3>
        <Flex alignItems="center" gap="var(--spacing-sm)">
          <Button
            flat
            onPress={() => navigateMonth('prev')}
            aria-label="Forrige måned"
          >
            <Icon iconNode={<ArrowLeft />}></Icon>
          </Button>
          {currentMonth.format('MMMM YYYY')}
          <Button
            flat
            onPress={() => navigateMonth('next')}
            aria-label="Neste måned"
          >
            <Icon iconNode={<ArrowRight />}></Icon>
          </Button>
        </Flex>
      </div>
      <table className={styles.calendar}>
        <thead>
          <tr>
            {['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'].map((d, i) => (
              <th key={i}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(
            {
              length: Math.ceil(createMonthlyCalendar(currentMonth).length / 7),
            },
            (_, i) => (
              <tr key={i}>
                {createMonthlyCalendar(currentMonth)
                  .slice(i * 7, i * 7 + 7)
                  .map((dateProps, j) => {
                    const selectedTimeRange = getSelectedTimeRange(
                      dateProps.day,
                    );
                    const timeRanges = getUnavailableTimeRanges(
                      selectedTimeRange,
                      dateProps.day,
                    );
                    const fully =
                      timeRanges.length > 0 &&
                      isFullyUnavailable(dateProps.day);
                    const fullLender = fully
                      ? getFullAvailableLender(dateProps.day)
                      : null;
                    const userDisplayName = fullLender ? fullLender[0] : null;
                    const userName = fullLender ? fullLender[1] : null;
                    const inSelectedRange = isInSelectedRange(dateProps.day);
                    const isEndpoint = isSelectedEndpoint(dateProps.day);

                    return (
                      <td
                        key={j}
                        className={cx(
                          styles.dayCell,
                          dateProps.day.isSame(moment(), 'day') && styles.today,
                        )}
                      >
                        <div
                          className={cx(
                            styles.calendarDayWrapper,
                            dateProps.prevOrNextMonth && styles.prevOrNextMonth,
                            inSelectedRange && styles.inSelectedRange,
                            isEndpoint && styles.selectedEndpoint,
                          )}
                        >
                          <div className={styles.dayNumber}>
                            {dateProps.day.date()}
                          </div>

                          <div className={styles.inlineTimes}>
                            {selectedTimeRange && (
                              <div className={styles.selectedTimeRange}>
                                {selectedTimeRange.fullDay
                                  ? ''
                                  : `${selectedTimeRange.start}-${selectedTimeRange.end}`}
                              </div>
                            )}

                            {!fully ? (
                              timeRanges.map((range, idx) => (
                                <Tooltip
                                  key={idx}
                                  className={styles.pin}
                                  content={
                                    range.userName ? (
                                      <>
                                        Lånt av:{' '}
                                        <a
                                          className={styles.lendingUserLink}
                                          href={`/users/${range.userName}`}
                                        >
                                          <>{range.userDisplayName}</>
                                        </a>
                                      </>
                                    ) : (
                                      <span>
                                        Lånt av: {range.userDisplayName}
                                      </span>
                                    )
                                  }
                                >
                                  <div key={idx} className={styles.timeRange}>
                                    {`${range.start}-${range.end}`}
                                  </div>
                                </Tooltip>
                              ))
                            ) : (
                              <Tooltip
                                key={idx}
                                className={styles.pin}
                                content={
                                  fullLender ? (
                                    <>
                                      Lånt av:{' '}
                                      <a
                                        className={styles.lendingUserLink}
                                        href={`/users/${userName}`}
                                      >
                                        <>{userDisplayName}</>
                                      </a>
                                    </>
                                  ) : (
                                    <span>Lånt av: {userDisplayName}</span>
                                  )
                                }
                              >
                                <div className={styles.timeRange} />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
              </tr>
            ),
          )}
        </tbody>
      </table>
      <Flex
        justifyContent="center"
        gap="var(--spacing-lg)"
        className={styles.calendarLegend}
      >
        <Flex alignItems="center" gap="var(--spacing-xs)">
          <div className={styles.legendItem}>
            <div className={cx(styles.legendColor, styles.selectedColor)}></div>
            <span>Valgt periode</span>
          </div>
        </Flex>
        <Flex alignItems="center" gap="var(--spacing-xs)">
          <div className={styles.legendItem}>
            <div
              className={cx(styles.legendColor, styles.unavailableColor)}
            ></div>
            <span>Utilgjengelig</span>
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default LendingCalendar;
