import {
  Button,
  FilterSection,
  filterSidebar,
  Flex,
  Icon,
  LinkButton,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty, orderBy } from 'lodash';
import { FilterX, FolderOpen } from 'lucide-react';
import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchEvents } from 'app/actions/EventActions';
import EmptyState from 'app/components/EmptyState';
import EventItem from 'app/components/EventItem';
import { CheckBox, RadioButton } from 'app/components/Form/';
import { EventTime } from 'app/models';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { selectAllEvents } from 'app/reducers/events';
import { selectPaginationNext } from 'app/reducers/selectors';
import sharedStyles from 'app/routes/joblistings/components/JoblistingList.module.css';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import useQuery from 'app/utils/useQuery';
import EventFooter from './EventFooter';
import styles from './EventList.module.css';
import EventsTabs from './EventsTabs';
import type { ListEvent } from 'app/store/models/Event';

type FilterEventType = 'company_presentation' | 'course' | 'social' | 'other';
type FilterRegistrationsType = 'all' | 'open' | 'future';

export const eventListDefaultQuery = {
  eventTypes: [] as FilterEventType[],
  registrations: 'all' as FilterRegistrationsType,
  showPrevious: '' as '' | 'true' | 'false',
};

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
      <h3>{name}</h3>
      <Flex column gap="var(--spacing-md)">
        {events.map((event) => (
          <EventItem key={event.id} event={event} showTags={false} />
        ))}
      </Flex>
    </div>
  );
};

type Option = {
  filterRegDateFunc: (event: ListEvent) => boolean;
  label: string;
  value: FilterRegistrationsType;
  field: EventTime;
};
const filterRegDateOptions: Option[] = [
  {
    filterRegDateFunc: (event) => !!event,
    label: 'Vis alle',
    value: 'all',
    field: EventTime.start,
  },
  {
    filterRegDateFunc: (event) =>
      event.activationTime != null &&
      moment(event.activationTime).isBefore(moment()),
    label: 'Påmelding åpnet',
    value: 'open',
    field: EventTime.start,
  },
  {
    filterRegDateFunc: (event) =>
      event.activationTime != null &&
      moment(event.activationTime).isAfter(moment()),
    label: 'Åpner i fremtiden',
    value: 'future',
    field: EventTime.activate,
  },
];

const EventList = () => {
  const { query, setQueryValue } = useQuery(eventListDefaultQuery);

  const regDateFilter =
    filterRegDateOptions.find(
      (option) => option.value === query.registrations,
    ) || filterRegDateOptions[0];

  const { field, filterRegDateFunc } = regDateFilter;

  const showCourse = query.eventTypes.includes('course');
  const showSocial = query.eventTypes.includes('social');
  const showOther = query.eventTypes.includes('other');
  const showCompanyPresentation = query.eventTypes.includes(
    'company_presentation',
  );

  const icalToken = useCurrentUser()?.icalToken;
  const loggedIn = useIsLoggedIn();

  const [previousStart, setPreviousStart] = useState(
    moment().subtract(2, 'week'),
  );
  const [previousEvents, setPreviousEvents] = useState<ListEvent[]>([]);

  const fetchQuery = {
    date_after:
      query.showPrevious === 'true'
        ? previousStart.format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),
    date_before:
      query.showPrevious === 'true' ? moment().format('YYYY-MM-DD') : undefined,
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

  const actionGrant = useAppSelector((state) => state.events.actionGrant);
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
    [loggedIn, query.showPrevious],
  );

  const fetchMore = () => {
    if (query.showPrevious === 'true') {
      const newStart = previousStart.clone().subtract(1, 'week');
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

  const filterPreviousEvents = (event: ListEvent) =>
    query.showPrevious === 'true'
      ? moment(event[field]).isBefore(moment())
      : true;

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
        .filter(filterEventTypesFunc)
        .filter(filterPreviousEvents),
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

  const toggleEventType =
    (type: 'company_presentation' | 'course' | 'social' | 'other') => () => {
      setQueryValue('eventTypes')(
        query.eventTypes.includes(type)
          ? query.eventTypes.filter((t) => t !== type)
          : [...query.eventTypes, type],
      );
    };

  return (
    <Page
      title="Arrangementer"
      sidebar={filterSidebar({
        children: (
          <>
            <FilterSection title="Vis tidligere">
              <RadioButton
                name="showPrevious"
                id="showPreviousYes"
                label="Ja"
                checked={query.showPrevious === 'true'}
                onChange={() => setQueryValue('showPrevious')('true')}
              />
              <RadioButton
                name="showPrevious"
                id="showPreviousNo"
                label="Nei"
                checked={query.showPrevious === 'false'}
                onChange={() => setQueryValue('showPrevious')('false')}
              />
            </FilterSection>
            <FilterSection title="Arrangementstype">
              <CheckBox
                id="companyPresentation"
                label="Bedpres"
                checked={showCompanyPresentation}
                onChange={toggleEventType('company_presentation')}
              />
              <CheckBox
                id="course"
                label="Kurs"
                checked={showCourse}
                onChange={toggleEventType('course')}
              />
              <CheckBox
                id="social"
                label="Sosialt"
                checked={showSocial}
                onChange={toggleEventType('social')}
              />
              <CheckBox
                id="other"
                label="Annet"
                checked={showOther}
                onChange={toggleEventType('other')}
              />
            </FilterSection>
            <FilterSection title="Påmelding">
              {filterRegDateOptions.map((option) => (
                <RadioButton
                  key={option.value}
                  name="registrations"
                  id={option.value}
                  label={option.label}
                  checked={query.registrations === option.value}
                  onChange={() => {
                    setQueryValue('registrations')(option.value);
                  }}
                />
              ))}
            </FilterSection>
          </>
        ),
      })}
      actionButtons={
        actionGrant?.includes('create') && (
          <LinkButton href="/events/create">Lag nytt</LinkButton>
        )
      }
      tabs={<EventsTabs />}
    >
      <Helmet title="Arrangementer" />
      <EventListGroup name="Tidligere" events={groupedEvents.previous} />
      <EventListGroup name="Denne uken" events={groupedEvents.currentWeek} />
      <EventListGroup name="Neste uke" events={groupedEvents.nextWeek} />
      <EventListGroup name="Senere" events={groupedEvents.later} />
      {isEmpty(events) && pagination.fetching && (
        <LoadingIndicator loading={pagination.fetching} />
      )}
      {isEmpty(events) && !pagination.fetching && (
        <EmptyState
          iconNode={<FolderOpen />}
          header="Her var det tomt ..."
          body={
            <>
              Ingen arrangementer {totalCount > 0 && 'som matcher ditt filter'}{' '}
              ligger
              {totalCount === 0 && ' for øyeblikket'} ute
              {totalCount > 0 && (
                <Button flat onPress={clearQueryParams}>
                  <Icon iconNode={<FilterX />} size={22} />
                  Tøm filter
                </Button>
              )}
            </>
          }
          className={sharedStyles.emptyState}
        />
      )}
      {(query.showPrevious === 'true'
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
    </Page>
  );
};

export default EventList;
