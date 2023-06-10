import { isEmpty, orderBy } from 'lodash';
import moment from 'moment-timezone';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Select from 'react-select';
import Button from 'app/components/Button';
import EmptyState from 'app/components/EmptyState';
import EventItem from 'app/components/EventItem';
import { CheckBox } from 'app/components/Form/';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import Icon from 'app/components/Icon';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { Event, ActionGrant, IcalToken } from 'app/models';
import { EventTime } from 'app/models';
import EventFooter from './EventFooter';
import styles from './EventList.module.css';
import Toolbar from './Toolbar';

type GroupedEvents = {
  currentWeek?: Event[];
  nextWeek?: Event[];
  later?: Event[];
};

const groupEvents = ({
  events,
  field = EventTime.start,
}: {
  events: Array<Event>;
  field?: EventTime;
}): GroupedEvents => {
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
  value: string;
  field: EventTime;
};
type State = {
  selectedOption: Option;
  filterEventTypesSettings: Record<string, any>;
};
const filterRegDateOptions: Array<Option> = [
  {
    filterRegDateFunc: (event) => !!event,
    label: 'Vis alle',
    value: 'Vis alle',
    field: EventTime.start,
  },
  {
    filterRegDateFunc: (event) =>
      event.activationTime != null &&
      moment(event.activationTime).isBefore(moment()),
    label: 'P\xe5melding \xe5pnet',
    value: 'P\xe5melding \xe5pnet',
    field: EventTime.start,
  },
  {
    filterRegDateFunc: (event) =>
      event.activationTime != null &&
      moment(event.activationTime).isAfter(moment()),
    label: '\xc5pner i fremtiden',
    value: '\xc5pner i fremtiden',
    field: EventTime.activate,
  },
];

class EventList extends Component<EventListProps, State> {
  constructor(props: EventListProps) {
    super(props);
    const locationFilters = props.location.state?.filterEventType || [];
    this.state = {
      selectedOption: filterRegDateOptions[0],
      filterEventTypesSettings: {
        showCompanyPresentation: locationFilters.includes(
          'showCompanyPresentation'
        ),
        showCourse: locationFilters.includes('showCourse'),
        showSocial: locationFilters.includes('showSocial'),
        showOther: locationFilters.includes('showOther'),
      },
    };
  }

  handleChange = (selectedOption: Option): void => {
    this.setState({
      selectedOption,
    });
  };
  handleFilterEventTypeChange = (eventType: string) => {
    this.setState((state) => ({
      filterEventTypesSettings: {
        ...state.filterEventTypesSettings,
        [eventType]: !state.filterEventTypesSettings[eventType],
      },
    }));
  };

  render() {
    const { icalToken, showFetchMore, fetchMore, events, loggedIn, fetching } =
      this.props;

    const { field, filterRegDateFunc } = this.state.selectedOption;
    const { showCompanyPresentation, showCourse, showSocial, showOther } =
      this.state.filterEventTypesSettings;

    const filterEventTypesFunc = (event) => {
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

    const groupedEvents = groupEvents({
      events: orderBy(
        events.filter(filterRegDateFunc).filter(filterEventTypesFunc),
        field
      ),
      field: field,
    });
    return (
      <div className={styles.root}>
        <Helmet title="Arrangementer" />
        <Toolbar actionGrant={this.props.actionGrant} />
        <div className={styles.filter}>
          <div className={styles.filterButtons}>
            <CheckBox
              id="companyPresentation"
              label="Bedpres"
              value={showCompanyPresentation}
              onChange={() =>
                this.handleFilterEventTypeChange('showCompanyPresentation')
              }
            />
            <CheckBox
              id="course"
              label="Kurs"
              value={showCourse}
              onChange={() => this.handleFilterEventTypeChange('showCourse')}
            />
            <CheckBox
              id="social"
              label="Sosialt"
              value={showSocial}
              onChange={() => this.handleFilterEventTypeChange('showSocial')}
            />
            <CheckBox
              id="other"
              label="Annet"
              value={showOther}
              onChange={() => this.handleFilterEventTypeChange('showOther')}
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
            value={this.state.selectedOption}
            onChange={this.handleChange}
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
  }
}

export default EventList;
