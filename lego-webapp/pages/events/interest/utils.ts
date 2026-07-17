import moment from 'moment-timezone';
import { EventStatusType } from '~/redux/models/Event';
import { capitalize } from '~/utils';
import gradients from './gradients.module.css';
import type { Moment } from 'moment-timezone';
import type { KeyboardEvent } from 'react';
import type { ListEvent } from '~/redux/models/Event';
import type { PublicGroup } from '~/redux/models/Group';

const GRADIENTS = [
  gradients.gradient0,
  gradients.gradient1,
  gradients.gradient2,
  gradients.gradient3,
  gradients.gradient4,
];

export const groupGradient = (group: PublicGroup) =>
  GRADIENTS[(Number(group.id) || 0) % GRADIENTS.length];

export const groupMonogram = (group: PublicGroup) =>
  group.name.replace('Aba', '').slice(0, 2).toUpperCase();

export const activateOnKey =
  (action: () => void) => (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

export const isToday = (time: Moment) => time.isSame(moment(), 'day');

export const isTomorrow = (time: Moment) =>
  time.isSame(moment().add(1, 'day'), 'day');

export const attendanceLabel = (event: ListEvent): string => {
  if (event.eventStatusType === EventStatusType.OPEN) {
    return 'ingen påmelding — bare møt opp';
  }

  const count = event.registrationCount ?? 0;

  if (event.totalCapacity) {
    return `${count} av ${event.totalCapacity} plasser tatt`;
  }

  return `${count} blir med`;
};

export type DayGroup = {
  key: string;
  label: string;
  subLabel: string;
  highlight: boolean;
  events: ListEvent[];
};

export const dayLabel = (start: Moment) => {
  if (isToday(start)) {
    return {
      label: 'I dag',
      subLabel: start.format('dddd D. MMMM'),
      highlight: true,
    };
  }

  if (isTomorrow(start)) {
    return {
      label: 'I morgen',
      subLabel: start.format('dddd D. MMMM'),
      highlight: true,
    };
  }

  return {
    label: capitalize(start.format('dddd')),
    subLabel: start.format('D. MMMM'),
    highlight: false,
  };
};

export const weekLabel = (start: Moment) => {
  const weekStart = start.clone().startOf('isoWeek');
  const weekEnd = start.clone().endOf('isoWeek');
  const thisWeek = moment().startOf('isoWeek');

  const label = weekStart.isSame(thisWeek, 'day')
    ? 'Denne uken'
    : weekStart.isSame(thisWeek.clone().subtract(1, 'week'), 'day')
      ? 'Forrige uke'
      : `Uke ${start.isoWeek()}`;

  const range =
    weekStart.month() === weekEnd.month()
      ? `${weekStart.format('D.')}–${weekEnd.format('D. MMM')}`
      : `${weekStart.format('D. MMM')} – ${weekEnd.format('D. MMM')}`;

  return {
    label,
    subLabel: weekStart.isSame(moment(), 'year')
      ? range
      : `${range} ${weekStart.format('YYYY')}`,
    highlight: false,
  };
};

// Upcoming events are grouped by day; past events by week
export const groupKeyOf = (start: Moment, isPast: boolean) =>
  isPast ? start.format('GGGG-WW') : start.format('YYYY-MM-DD');

export const groupEvents = (
  events: ListEvent[],
  isPast: boolean,
): DayGroup[] => {
  const groups: Record<string, DayGroup> = {};
  const order: string[] = [];

  for (const event of events) {
    const start = moment(event.startTime);
    const key = groupKeyOf(start, isPast);

    if (!groups[key]) {
      groups[key] = {
        key,
        ...(isPast ? weekLabel(start) : dayLabel(start)),
        events: [],
      };
      order.push(key);
    }

    groups[key].events.push(event);
  }

  return order.map((key) => groups[key]);
};
