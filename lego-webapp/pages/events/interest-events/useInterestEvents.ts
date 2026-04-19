import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { fetchEvents } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EventType } from '~/redux/models/Event';
import { EntityType } from '~/redux/models/entities';
import { useCurrentUser, useIsLoggedIn } from '~/redux/slices/auth';
import { selectInterestEvents } from '~/redux/slices/events';
import { selectPaginationNext } from '~/redux/slices/selectors';
import useQuery from '~/utils/useQuery';
import { groupEvents } from './utils';
import type { GroupedEvents } from './types';
import type { ListEvent } from '~/redux/models/Event';

const DEFAULT_QUERY = { from: '', to: '' };

type UseInterestEventsResult = {
  groupedEvents: GroupedEvents;
  hasEvents: boolean;
  isFetching: boolean;
};

export const useInterestEvents = (): UseInterestEventsResult => {
  const { query } = useQuery(DEFAULT_QUERY);
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
        }) as ListEvent[])
      : [],
  );

  const pastEvents = useAppSelector((state) =>
    shouldFetchPast
      ? (selectInterestEvents(state, {
          pagination: pastPagination,
        }) as ListEvent[])
      : [],
  );

  usePreparedEffect(
    'fetchUpcomingInterestEvents',
    () =>
      shouldFetchUpcoming
        ? dispatch(fetchEvents({ query: upcomingQuery }))
        : undefined,
    [loggedIn, query.from, query.to],
  );

  usePreparedEffect(
    'fetchPastInterestEvents',
    () =>
      shouldFetchPast
        ? dispatch(fetchEvents({ query: pastQuery }))
        : undefined,
    [loggedIn, query.from, query.to],
  );

  const allEvents = [...upcomingEvents, ...pastEvents].filter(
    (event, index, self) => index === self.findIndex((e) => e.id === event.id),
  );

  const groupedEvents = groupEvents(allEvents, currentUser?.abakusGroups ?? []);
  const hasEvents = Object.values(groupedEvents).some((g) => g.length > 0);
  const isFetching =
    (shouldFetchUpcoming && upcomingPagination.fetching) ||
    (shouldFetchPast && pastPagination.fetching);

  return { groupedEvents, hasEvents, isFetching };
};
