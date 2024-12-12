import {
  Button,
  FilterSection,
  filterSidebar,
  Flex,
  LinkButton,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty, orderBy } from 'lodash';
import { FolderOpen } from 'lucide-react';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { fetchEvents } from 'app/actions/EventActions';
import EmptyState from 'app/components/EmptyState';
import EventItem from 'app/components/EventItem';
import { CheckBox, SelectInput } from 'app/components/Form/';
import { EventTime } from 'app/models';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { selectAllEvents } from 'app/reducers/events';
import { selectPaginationNext } from 'app/reducers/selectors';
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
};

type GroupedEvents = {
  currentWeek?: ListEvent[];
  nextWeek?: ListEvent[];
  later?: ListEvent[];
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
  };
  return events.reduce((result, event) => {
    for (const groupName in groups) {
      if (groups[groupName](event)) {
        result[groupName] = (result[groupName] || []).concat(event);
        return result;
      }
    }

    return result;
  }, {});
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
const filterRegDateOptions: Array<Option> = [
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

  const fetchQuery = {
    date_after: moment().format('YYYY-MM-DD'),
  };

  const { pagination } = useAppSelector(
    selectPaginationNext({
      entity: EntityType.Events,
      endpoint: '/events/',
      query: fetchQuery,
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
    [loggedIn],
  );

  const fetchMore = () =>
    dispatch(
      fetchEvents({
        query: fetchQuery,
        next: true,
      }),
    );

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

  const groupedEvents = groupEvents(
    orderBy(
      events.filter(filterRegDateFunc).filter(filterEventTypesFunc),
      field,
    ),
    field,
  );

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
              <SelectInput
                name="form-field-name"
                value={regDateFilter}
                onChange={(selectedOption) =>
                  selectedOption &&
                  setQueryValue('registrations')(selectedOption.value)
                }
                className={styles.select}
                options={filterRegDateOptions}
                isClearable={false}
              />
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
      <EventListGroup name="Denne uken" events={groupedEvents.currentWeek} />
      <EventListGroup name="Neste uke" events={groupedEvents.nextWeek} />
      <EventListGroup name="Senere" events={groupedEvents.later} />
      {isEmpty(events) && pagination.fetching && <LoadingIndicator loading />}
      {isEmpty(events) && !pagination.fetching && (
        <EmptyState
          iconNode={<FolderOpen />}
          body="Ingen kommende arrangementer"
        />
      )}
      {pagination.hasMore && field === 'startTime' && (
        <Button
          onPress={fetchMore}
          isPending={!isEmpty(events) && pagination.fetching}
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
