import { Button, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { isEmpty, orderBy } from 'lodash';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import Select from 'react-select';
import EmptyState from 'app/components/EmptyState';
import EventItem from 'app/components/EventItem';
import { CheckBox } from 'app/components/Form/';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import { EventTime } from 'app/models';
import useQuery from 'app/utils/useQuery';
import EventFooter from './EventFooter';
import styles from './EventList.css';
import Toolbar from './Toolbar';
import type { Event, ActionGrant, IcalToken } from 'app/models';
import type { ListEvent } from 'app/store/models/Event';

type FilterEventType = 'company_presentation' | 'course' | 'social' | 'other';
type FilterRegistrationsType = 'all' | 'open' | 'future';
export const eventListDefaultQuery = {
  eventTypes: [] as FilterEventType[],
  registrations: 'all' as FilterRegistrationsType,
};

type GroupedEvents = {
  currentWeek?: Event[];
  nextWeek?: Event[];
  later?: Event[];
};

const groupEvents = (
  events: Array<Event>,
  field?: EventTime = EventTime.start
): GroupedEvents => {
  const nextWeek = moment().add(1, 'week');
  const groups = {
    currentWeek: (event) => moment(event[field]).isSame(moment(), 'week'),
    nextWeek: (event) => moment(event[field]).isSame(nextWeek, 'week'),
    later: (event) => moment(event[field]).isAfter(nextWeek),
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
  field = EventTime.start,
  events = [],
  loggedIn = false,
}: {
  name: string;
  field?: EventTime;
  events?: Array<Event>;
  loggedIn: boolean;
}) => {
  return isEmpty(events) ? null : (
    <div className={styles.eventGroup}>
      <h2 className={styles.heading}>{name}</h2>
      {events.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          field={field}
          showTags={false}
          loggedIn={loggedIn}
        />
      ))}
    </div>
  );
};

type EventListProps = {
  events: Array<Event>;
  actionGrant: ActionGrant;
  icalToken: IcalToken;
  showFetchMore: boolean;
  fetchMore: () => Promise<any>;
  loggedIn: boolean;
  location: Record<string, any>;
  fetching: boolean;
};
type Option = {
  filterRegDateFunc: (arg0: Event) => boolean;
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

const EventList = ({
  icalToken,
  showFetchMore,
  fetchMore,
  events,
  loggedIn,
  fetching,
  actionGrant,
}: EventListProps) => {
  const { query, setQueryValue } = useQuery(eventListDefaultQuery);

  const regDateFilter =
    filterRegDateOptions.find(
      (option) => option.value === query.registrations
    ) || filterRegDateOptions[0];

  const { field, filterRegDateFunc } = regDateFilter;

  const showCourse = query.eventTypes.includes('course');
  const showSocial = query.eventTypes.includes('social');
  const showOther = query.eventTypes.includes('other');
  const showCompanyPresentation = query.eventTypes.includes(
    'company_presentation'
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
      case 'kid_event':
        return showOther;

      default:
        return true;
    }
  };

  const groupedEvents = groupEvents(
    orderBy(
      events.filter(filterRegDateFunc).filter(filterEventTypesFunc),
      field
    ),
    field
  );

  const toggleEventType =
    (type: 'company_presentation' | 'course' | 'social' | 'other') => () => {
      setQueryValue('eventTypes')(
        query.eventTypes.includes(type)
          ? query.eventTypes.filter((t) => t !== type)
          : [...query.eventTypes, type]
      );
    };

  return (
    <div className={styles.root}>
      <Helmet title="Arrangementer" />
      <Toolbar actionGrant={actionGrant} />
      <div className={styles.filter}>
        <div className={styles.filterButtons}>
          <CheckBox
            id="companyPresentation"
            label="Bedpres"
            value={showCompanyPresentation}
            onChange={toggleEventType('company_presentation')}
          />
          <CheckBox
            id="course"
            label="Kurs"
            value={showCourse}
            onChange={toggleEventType('course')}
          />
          <CheckBox
            id="social"
            label="Sosialt"
            value={showSocial}
            onChange={toggleEventType('social')}
          />
          <CheckBox
            id="other"
            label="Annet"
            value={showOther}
            onChange={toggleEventType('other')}
          />
        </div>
        <Icon
          name="funnel-outline"
          size={25}
          style={{
            marginRight: '5px',
            marginLeft: '10px',
          }}
        />
        <Select
          name="form-field-name"
          value={regDateFilter}
          onChange={(selectedOption) =>
            selectedOption &&
            setQueryValue('registrations')(selectedOption.value)
          }
          className={styles.select}
          options={filterRegDateOptions}
          isClearable={false}
          theme={selectTheme}
          styles={selectStyles}
        />
      </div>
      <EventListGroup
        name="Denne uken"
        events={groupedEvents.currentWeek}
        field={field}
        loggedIn={loggedIn}
      />
      <EventListGroup
        name="Neste uke"
        events={groupedEvents.nextWeek}
        field={field}
        loggedIn={loggedIn}
      />
      <EventListGroup
        name="Senere"
        events={groupedEvents.later}
        field={field}
        loggedIn={loggedIn}
      />
      {isEmpty(events) && fetching && <LoadingIndicator loading />}
      {isEmpty(events) && !fetching && (
        <EmptyState icon="book-outline" size={40}>
          <h2 className={styles.noEvents}>Ingen kommende arrangementer</h2>
        </EmptyState>
      )}
      {showFetchMore && field === 'startTime' && (
        <Button onClick={fetchMore}>Last inn mer</Button>
      )}
      <div className={styles.bottomBorder} />
      <EventFooter icalToken={icalToken} />
    </div>
  );
};

export default EventList;
