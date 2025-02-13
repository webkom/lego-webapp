import { Button, Flex, Icon, Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty, orderBy } from 'lodash';
import { FilterX, FolderOpen } from 'lucide-react';
import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useOutletContext } from 'react-router';
import { fetchEvents } from 'app/actions/EventActions';
import EmptyState from 'app/components/EmptyState';
import EventItem from 'app/components/EventItem';
import eventItemStyles from 'app/components/EventItem/styles.module.css';
import { EventTime } from 'app/models';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { selectAllEvents } from 'app/reducers/events';
import { selectPaginationNext } from 'app/reducers/selectors';
import joblistingListStyles from 'app/routes/joblistings/components/JoblistingList.module.css';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import EventFooter from './EventFooter';
import styles from './EventList.module.css';
import type { EventsOutletContext } from './EventsOverview';
import type { ListEvent } from 'app/store/models/Event';

type GroupedEvents = {
  currentWeek?: ListEvent[];
  nextWeek?: ListEvent[];
  later?: ListEvent[];
  previous?: ListEvent[];
};

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
    for (const groupName in groups) {
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

const EventList = () => {
  const {
    query,
    regDateFilter,
    showCourse,
    showSocial,
    showOther,
    showCompanyPresentation,
  } = useOutletContext<EventsOutletContext>();

  const { field, filterRegDateFunc } = regDateFilter;

  const icalToken = useCurrentUser()?.icalToken;
  const loggedIn = useIsLoggedIn();

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
      },
    }),
  );

  const events = useAppSelector((state) =>
    selectAllEvents<ListEvent>(state, { pagination }),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEventList',
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

  const filterEventTypesFunc = (event: ListEvent) => {
    if (!showCompanyPresentation && !showCourse && !showSocial && !showOther)
      return true;

    switch (event.eventType) {
      case 'company_presentation':
      case 'lunch_presentation':
        return showCompanyPresentation;

      case 'alternative_presentation':
        return showSocial || showCompanyPresentation;

      case 'course':
      case 'breakfast_talk':
        return showCourse;

      case 'event':
      case 'social':
      case 'party':
        return showSocial;

      case 'other':
      case 'nexus_event':
        return showOther;

      default:
        return true;
    }
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
            index === self.findIndex((e) => e.id === event.id),
        )
        .filter(filterRegDateFunc)
        .filter(filterEventTypesFunc),
      field,
      query.showPrevious === 'true' ? 'desc' : 'asc',
    ),
    field,
  );
  const totalCount = events.length;

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const clearQueryParams = () => {
    navigate(pathname);
  };

  return (
    <>
      <Helmet title="Arrangementer" />
      <EventListGroup name="Tidligere" events={groupedEvents.previous} />
      <EventListGroup name="Denne uken" events={groupedEvents.currentWeek} />
      <EventListGroup name="Neste uke" events={groupedEvents.nextWeek} />
      <EventListGroup name="Senere" events={groupedEvents.later} />
      {isEmpty(events) && pagination.fetching && (
        <>
          <div className={styles.eventGroup}>
            {isEmpty(groupedEvents) && (
              <Skeleton className={styles.skeletonEventGroupTitle} />
            )}
            <Flex column gap="var(--spacing-md)">
              <Skeleton array={3} className={eventItemStyles.eventItem} />
            </Flex>
          </div>
          <div className={styles.eventGroup}>
            {isEmpty(groupedEvents) && (
              <Skeleton className={styles.skeletonEventGroupTitle} />
            )}
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
          body={
            <>
              Ingen arrangementer{' '}
              {totalCount > 0 || (!isEmpty(query) && 'som matcher ditt filter')}{' '}
              ligger
              {totalCount === 0 && ' for øyeblikket'} ute
              {totalCount > 0 && (
                <Button flat onPress={clearQueryParams}>
                  <Icon iconNode={<FilterX />} size={19} />
                  Tøm filter
                </Button>
              )}
            </>
          }
          className={joblistingListStyles.emptyState}
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

export default EventList;
