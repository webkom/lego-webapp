import { Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty, orderBy } from 'lodash-es';
import { FolderOpen } from 'lucide-react';
import moment from 'moment-timezone';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import EmptyState from '~/components/EmptyState';
import styles from '~/pages/events/index/EventList.module.css';
import { fetchEvents } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EventType } from '~/redux/models/Event';
import { EntityType } from '~/redux/models/entities';
import { useCurrentUser, useIsLoggedIn } from '~/redux/slices/auth';
import { selectInterestEvents } from '~/redux/slices/events';
import { selectPaginationNext } from '~/redux/slices/selectors';
import EventRows from './EventRows';
import { EventsOutletContext } from '../+Layout';
import type { EntityId } from '@reduxjs/toolkit';
import type { ListEvent } from '~/redux/models/Event';

type EventWithResponsibleGroup = ListEvent & {
  responsibleGroup?: {
    id: EntityId;
    name: string;
  };
};

type GroupedEvents = {
  interestedEvents?: EventWithResponsibleGroup[];
  upcomingEvents?: EventWithResponsibleGroup[];
  pastEvents?: EventWithResponsibleGroup[];
};

const ROW_ORDER = ['interestedEvents', 'upcomingEvents', 'pastEvents'] as const;
type GroupName = (typeof ROW_ORDER)[number];

const GROUP_LABELS: Record<GroupName, string> = {
  interestedEvents: 'Dine interessegrupper',
  upcomingEvents: 'Kommende',
  pastEvents: 'Tidligere',
};

const isPastEvent = (event: ListEvent) =>
  moment(event.startTime).isBefore(moment());

const belongsToUserInterestGroup = (
  event: EventWithResponsibleGroup,
  currentUserGroupIds: EntityId[],
) =>
  event.responsibleGroup?.id != null &&
  currentUserGroupIds.includes(event.responsibleGroup.id);

const sortUpcomingEvents = (events: EventWithResponsibleGroup[]) =>
  orderBy(events, 'startTime', 'asc');

const sortPastEvents = (events: EventWithResponsibleGroup[]) =>
  orderBy(events, 'startTime', 'desc');

const groupEvents = (
  events: EventWithResponsibleGroup[],
  currentUserGroupIds: EntityId[],
): GroupedEvents => {
  const upcomingEvents = sortUpcomingEvents(
    events.filter((event) => !isPastEvent(event)),
  );
  const pastEvents = sortPastEvents(
    events.filter((event) => isPastEvent(event)),
  );
  const interestedUpcomingEvents = upcomingEvents.filter((event) =>
    belongsToUserInterestGroup(event, currentUserGroupIds),
  );
  const interestedPastEvents = pastEvents.filter((event) =>
    belongsToUserInterestGroup(event, currentUserGroupIds),
  );

  return {
    interestedEvents: [...interestedUpcomingEvents, ...interestedPastEvents],
    upcomingEvents,
    pastEvents,
  };
};

const EventListRow = ({
  name,
  events = [],
}: {
  name: string;
  events?: EventWithResponsibleGroup[];
}) => {
  if (isEmpty(events)) {
    return null;
  }

  return (
    <section className={styles.eventGroup}>
      <EventRows title={name} events={events} />
    </section>
  );
};

const EventListSkeleton = () => (
  <>
    {ROW_ORDER.map((groupName) => (
      <div key={groupName} className={styles.eventGroup}>
        <Skeleton className={styles.skeletonEventGroupTitle} />
        <div className={styles.horizontalEventRow}>
          <Skeleton array={3} className={styles.horizontalEventCardSkeleton} />
        </div>
      </div>
    ))}
  </>
);

const InterestEventList = () => {
  const { query, regDateFilter } = useContext(EventsOutletContext);
  const { filterRegDateFunc } = regDateFilter;

  const currentUser = useCurrentUser();
  const loggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();

  const today = moment();
  const todayString = today.format('YYYY-MM-DD');
  const fromDate = query.from ? moment(query.from) : undefined;
  const toDate = query.to ? moment(query.to) : undefined;
  const shouldFetchUpcoming = !toDate || !toDate.isBefore(today, 'day');
  const shouldFetchPast = !fromDate || !fromDate.isAfter(today, 'day');

  const upcomingQuery = {
    date_after:
      fromDate && fromDate.isAfter(today, 'day') ? query.from : todayString,
    date_before: query.to || undefined,
    event_type: EventType.INTEREST_EVENT,
    ordering: 'start_time',
  };

  const pastQuery = {
    date_after: query.from || undefined,
    date_before:
      toDate && toDate.isBefore(today, 'day') ? query.to : todayString,
    event_type: EventType.INTEREST_EVENT,
    ordering: '-start_time',
  };

  const { pagination: upcomingPagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/',
      query: upcomingQuery,
    }),
  );

  const { pagination: pastPagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/',
      query: pastQuery,
    }),
  );

  const upcomingEvents = useAppSelector((state) =>
    shouldFetchUpcoming
      ? (selectInterestEvents(state, {
          pagination: upcomingPagination,
        }) as EventWithResponsibleGroup[])
      : [],
  );

  const pastEvents = useAppSelector((state) =>
    shouldFetchPast
      ? (selectInterestEvents(state, {
          pagination: pastPagination,
        }) as EventWithResponsibleGroup[])
      : [],
  );

  usePreparedEffect(
    'fetchUpcomingInterestEvents',
    () =>
      shouldFetchUpcoming
        ? dispatch(
            fetchEvents({
              query: upcomingQuery,
            }),
          )
        : undefined,
    [loggedIn, query.from, query.to],
  );

  usePreparedEffect(
    'fetchPastInterestEvents',
    () =>
      shouldFetchPast
        ? dispatch(
            fetchEvents({
              query: pastQuery,
            }),
          )
        : undefined,
    [loggedIn, query.from, query.to],
  );

  const filteredEvents = [...upcomingEvents, ...pastEvents]
    .filter(
      (event, index, self) =>
        index ===
        self.findIndex((existingEvent) => existingEvent.id === event.id),
    )
    .filter(filterRegDateFunc);

  const groupedEvents = groupEvents(
    filteredEvents,
    currentUser?.abakusGroups || [],
  );

  const hasEvents = ROW_ORDER.some(
    (groupName) => !isEmpty(groupedEvents[groupName]),
  );
  const isFetching =
    (shouldFetchUpcoming && upcomingPagination.fetching) ||
    (shouldFetchPast && pastPagination.fetching);
  const hasMore =
    (shouldFetchUpcoming && upcomingPagination.hasMore) ||
    (shouldFetchPast && pastPagination.hasMore);

  const fetchMore = () => {
    if (shouldFetchUpcoming && upcomingPagination.hasMore) {
      dispatch(
        fetchEvents({
          query: upcomingQuery,
          next: true,
        }),
      );
    }

    if (shouldFetchPast && pastPagination.hasMore) {
      dispatch(
        fetchEvents({
          query: pastQuery,
          next: true,
        }),
      );
    }
  };

  return (
    <>
      <Helmet title="Interessearrangementer" />
      {ROW_ORDER.map((groupName) => (
        <EventListRow
          key={groupName}
          name={GROUP_LABELS[groupName]}
          events={groupedEvents[groupName]}
        />
      ))}
      {!hasEvents && isFetching && <EventListSkeleton />}
      {!hasEvents && !isFetching && (
        <EmptyState
          iconNode={<FolderOpen />}
          header="Her var det tomt ..."
          body="Ingen interessearrangementer ligger ute akkurat nå."
        />
      )}
    </>
  );
};

export default InterestEventList;
