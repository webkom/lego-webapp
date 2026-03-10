import { Button, Flex, Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty, orderBy } from 'lodash-es';
import { FolderOpen } from 'lucide-react';
import moment from 'moment-timezone';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { EventTime } from 'app/models';
import { EventsOutletContext } from '../+Layout';
import type { ListEvent } from '~/redux/models/Event';
import EmptyState from '~/components/EmptyState';
import EventItem from '~/components/EventItem';
import eventItemStyles from '~/components/EventItem/styles.module.css';
import EventFooter from '~/pages/events/index/EventFooter';
import styles from '~/pages/events/index/EventList.module.css';
import { fetchEvents } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EventType } from '~/redux/models/Event';
import { EntityType } from '~/redux/models/entities';
import { useCurrentUser, useIsLoggedIn } from '~/redux/slices/auth';
import { selectInterestEvents } from '~/redux/slices/events';
import { selectPaginationNext } from '~/redux/slices/selectors';

type GroupedEvents = {
  currentWeek?: ListEvent[];
  nextWeek?: ListEvent[];
  later?: ListEvent[];
  previous?: ListEvent[];
};

const GROUPS = ['currentWeek', 'nextWeek', 'later', 'previous'] as const;

const groupEvents = (
  events: ListEvent[],
  field: EventTime = EventTime.start,
): GroupedEvents => {
  const nextWeek = moment().add(1, 'week');
  const groups = {
    currentWeek: (event: ListEvent) =>
      moment(event[field]).isSame(moment(), 'week'),
    nextWeek: (event: ListEvent) =>
      moment(event[field]).isSame(nextWeek, 'week'),
    later: (event: ListEvent) => moment(event[field]).isAfter(nextWeek),
    previous: (event: ListEvent) => moment(event[field]).isBefore(moment()),
  };

  const initialGroups: GroupedEvents = {};

  return events.reduce((result, event) => {
    for (const groupName of GROUPS) {
      if (groups[groupName](event)) {
        result[groupName] = [...(result[groupName] || []), event];
        break;
      }
    }

    return result;
  }, initialGroups);
};

const EventListGroup = ({
  name,
  events = [],
}: {
  name: string;
  events?: ListEvent[];
}) => {
  return isEmpty(events) ? null : (
    <div className={styles.eventGroup}>
      <h3 className={styles.eventGroupTitle}>{name}</h3>
      <Flex column gap="var(--spacing-md)">
        {events.map((event) => (
          <EventItem key={event.id} event={event} showTags={false} />
        ))}
      </Flex>
    </div>
  );
};

const InterestEventList = () => {
  const { query, regDateFilter } = useContext(EventsOutletContext);
  const { field, filterRegDateFunc } = regDateFilter;

  const icalToken = useCurrentUser()?.icalToken;
  const loggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();

  const [previousStart, setPreviousStart] = useState(
    moment().subtract(1, 'month'),
  );
  const [previousEvents, setPreviousEvents] = useState<ListEvent[]>([]);

  const fetchQuery = {
    date_after:
      query.from ||
      (query.showPrevious === 'true'
        ? previousStart.format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD')),
    date_before:
      query.to ||
      (query.showPrevious === 'true'
        ? moment().format('YYYY-MM-DD')
        : undefined),
    event_type: EventType.INTEREST_EVENT,
    ordering: query.showPrevious === 'true' ? '-start_time' : 'start_time',
  };

  const { pagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/',
      query: fetchQuery,
    }),
  );

  const { pagination: previousPagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/',
      query: {
        date_before: moment().format('YYYY-MM-DD'),
        event_type: EventType.INTEREST_EVENT,
      },
    }),
  );

  const events = useAppSelector((state) =>
    selectInterestEvents(state, { pagination }),
  );

  usePreparedEffect(
    'fetchInterestEventList',
    () =>
      dispatch(
        fetchEvents({
          query: fetchQuery,
        }),
      ),
    [loggedIn, query.from, query.to, query.showPrevious],
  );

  const fetchMore = () => {
    if (query.from || query.to) {
      return dispatch(
        fetchEvents({
          query: fetchQuery,
          next: true,
        }),
      );
    }

    if (query.showPrevious === 'true') {
      const newStart = previousStart.clone().subtract(1, 'month');
      setPreviousStart(newStart);

      return dispatch(
        fetchEvents({
          query: {
            ...fetchQuery,
            date_after: newStart.format('YYYY-MM-DD'),
            date_before: moment().format('YYYY-MM-DD'),
          },
        }),
      );
    }

    return dispatch(
      fetchEvents({
        query: fetchQuery,
        next: true,
      }),
    );
  };

  useEffect(() => {
    if (!pagination.fetching && events.length > 0) {
      setPreviousEvents(events);
    }
  }, [events, pagination.fetching]);

  const groupedEvents = groupEvents(
    orderBy(
      [...previousEvents, ...events]
        .filter(
          (event, index, self) =>
            index ===
            self.findIndex((existingEvent) => existingEvent.id === event.id),
        )
        .filter(filterRegDateFunc),
      field,
      query.showPrevious === 'true' ? 'desc' : 'asc',
    ),
    field,
  );

  return (
    <>
      <Helmet title="Interessearrangementer" />
      <EventListGroup name="Tidligere" events={groupedEvents.previous} />
      <EventListGroup name="Denne uken" events={groupedEvents.currentWeek} />
      <EventListGroup name="Neste uke" events={groupedEvents.nextWeek} />
      <EventListGroup name="Senere" events={groupedEvents.later} />
      {isEmpty(events) && pagination.fetching && (
        <>
          <div className={styles.eventGroup}>
            <Skeleton className={styles.skeletonEventGroupTitle} />
            <Flex column gap="var(--spacing-md)">
              <Skeleton array={3} className={eventItemStyles.eventItem} />
            </Flex>
          </div>
          <div className={styles.eventGroup}>
            <Skeleton className={styles.skeletonEventGroupTitle} />
            <Flex column gap="var(--spacing-md)">
              <Skeleton array={5} className={eventItemStyles.eventItem} />
            </Flex>
          </div>
        </>
      )}
      {isEmpty(groupedEvents) && !pagination.fetching && (
        <EmptyState
          iconNode={<FolderOpen />}
          header="Her var det tomt ..."
          body="Ingen interessearrangementer ligger ute akkurat nå."
        />
      )}
      {(query.showPrevious === 'true' && (!query.from || !query.to)
        ? previousPagination.hasMore
        : pagination.hasMore) && (
        <Button
          onPress={fetchMore}
          isPending={
            !isEmpty(events) &&
            (pagination.fetching || previousPagination.fetching)
          }
        >
          Last inn mer
        </Button>
      )}
      <div className={styles.bottomBorder} />
      {icalToken && <EventFooter icalToken={icalToken} />}
    </>
  );
};

export default InterestEventList;
