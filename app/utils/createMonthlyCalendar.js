// @flow

import moment from 'moment-timezone';
import { range, takeWhile, last } from 'lodash';

/**
 * Generate days of an entire month.
 *
 * @TODO: memoize
 */
export default function createMonthlyCalendar(
  date: moment,
  weekOffset: number = 0
) {
  const startOfMonth = date.startOf('month');

  let diff = startOfMonth.weekday() - weekOffset;
  if (diff < 0) diff += 7;

  const prevMonthDays = range(0, diff).map(n => ({
    day: startOfMonth.clone().subtract(diff - n, 'days'),
    prevOrNextMonth: true
  }));

  const currentMonthDays = range(1, date.daysInMonth() + 1).map(index => ({
    day: moment([date.year(), date.month(), index]),
    prevOrNextMonth: false
  }));

  const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;
  const nextMonthDays = takeWhile(
    range(1, 7),
    n => (daysAdded + n) % 7 !== 0
  ).map(n => ({
    day: last(currentMonthDays)
      .day.clone()
      .add(n, 'days'),
    prevOrNextMonth: true
  }));

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
}
