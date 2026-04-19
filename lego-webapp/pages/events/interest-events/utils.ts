import { orderBy } from 'lodash-es';
import moment from 'moment-timezone';
import type { EntityId } from '@reduxjs/toolkit';
import type { EventWithResponsibleGroup, GroupedEvents, GroupName } from './types';
import { ROW_ORDER } from './types';

export const GROUP_LABELS: Record<GroupName, string> = {
  dineGrupper: 'Dine grupper',
  denneUken: 'Denne uken',
  kommende: 'Kommende',
  tidligere: 'Tidligere arrangementer',
};

export const GROUP_SUBTITLES: Record<GroupName, string> = {
  dineGrupper: 'Basert på medlemskap',
  denneUken: '',
  kommende: 'Fremtidige arrangementer',
  tidligere: 'Tilbakeblikk',
};

export const getWeekSubtitle = (): string => {
  const start = moment().startOf('isoWeek');
  const end = moment().endOf('isoWeek');
  return start.month() === end.month()
    ? `${start.format('D.')} – ${end.format('D. MMMM')}`
    : `${start.format('D. MMM')} – ${end.format('D. MMM')}`;
};

export const emptyGroupedEvents = (): GroupedEvents => ({
  dineGrupper: [],
  denneUken: [],
  kommende: [],
  tidligere: [],
});

export const groupEvents = (
  events: EventWithResponsibleGroup[],
  currentUserGroupIds: EntityId[],
): GroupedEvents => {
  const now = moment();
  const startOfWeek = moment().startOf('isoWeek');
  const endOfWeek = moment().endOf('isoWeek');
  const result = emptyGroupedEvents();
  const seen = new Set<EntityId>();

  const assign = (event: EventWithResponsibleGroup, bucket: GroupName) => {
    if (seen.has(event.id)) return;
    seen.add(event.id);
    result[bucket].push(event);
  };

  const upcoming = orderBy(
    events.filter((e) => moment(e.startTime).isSameOrAfter(now)),
    'startTime',
    'asc',
  );
  const past = orderBy(
    events.filter((e) => moment(e.startTime).isBefore(now)),
    'startTime',
    'desc',
  );

  for (const event of upcoming) {
    const isUserGroup =
      event.responsibleGroup?.id != null &&
      currentUserGroupIds.includes(event.responsibleGroup.id);
    const isThisWeek = moment(event.startTime).isBetween(
      startOfWeek,
      endOfWeek,
      'day',
      '[]',
    );

    if (isUserGroup) assign(event, 'dineGrupper');
    else if (isThisWeek) assign(event, 'denneUken');
    else assign(event, 'kommende');
  }

  for (const event of past) {
    assign(event, 'tidligere');
  }

  return result;
};
