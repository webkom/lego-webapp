// @flow

import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Select from 'react-select';
import { isEmpty, orderBy } from 'lodash';
import moment from 'moment-timezone';

import Button from 'app/components/Button';
import EmptyState from 'app/components/EmptyState';
import EventItem from 'app/components/EventItem';
import { CheckBox } from 'app/components/Form/';
import { selectStyles, selectTheme } from 'app/components/Form/SelectInput';
import Icon from 'app/components/Icon';
import type { ActionGrant, Event, EventTimeType, IcalToken } from 'app/models';
import { EVENTFIELDS } from 'app/utils/constants';
import EventFooter from './EventFooter';
import Toolbar from './Toolbar';

import styles from './EventList.css';

const groupEvents = ({
  events,
  field = 'startTime',
}: {
  events: Array<Event>,
  field?: EventTimeType,
}) => {
  const nextWeek = moment().add(1, 'week');
  const groups = {
    currentWeek: (event) => event[field].isSame(moment(), 'week'),
    nextWeek: (event) => event[field].isSame(nextWeek, 'week'),
    later: (event) => event[field].isAfter(nextWeek),
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
  field = 'startTime',
  events = [],
  loggedIn = false,
}: {
  name: string,
  field?: EventTimeType,
  events?: Array<Event>,
  loggedIn: boolean,
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
  events: Array<Event>,
  actionGrant: ActionGrant,
  icalToken: IcalToken,
  showFetchMore: boolean,
  fetchMore: () => Promise<*>,
  loggedIn: boolean,
};

type Option = {
  filterRegDateFunc: (Event) => boolean,
  label: string,
  field: EventTimeType,
};

type State = {
  selectedOption: Option,
  filterEventTypesSettings: Object,
};

const filterRegDateOptions: Array<Option> = [
  {
    filterRegDateFunc: (event) => !!event,
    label: 'Vis alle',
    value: 'Vis alle',
    field: EVENTFIELDS.start,
  },
  {
    filterRegDateFunc: (event) =>
      event.activationTime != null &&
      moment(event.activationTime).isBefore(moment()),
    label: 'P\xe5melding \xe5pnet',
    value: 'P\xe5melding \xe5pnet',
    field: EVENTFIELDS.start,
  },
  {
    filterRegDateFunc: (event) =>
      event.activationTime != null &&
      moment(event.activationTime).isAfter(moment()),
    label: '\xc5pner i fremtiden',
    value: '\xc5pner i fremtiden',
    field: EVENTFIELDS.activate,
  },
];

class EventList extends Component<EventListProps, State> {
  state = {
    selectedOption: filterRegDateOptions[0],
    filterEventTypesSettings: {
      showCompanyPresentation: false,
      showCourse: false,
      showSocial: false,
      showOther: false,
    },
  };

  handleChange = (selectedOption: Option): void => {
    this.setState({ selectedOption });
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
    const { icalToken, showFetchMore, fetchMore, events, loggedIn } =
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
          return showCourse;
        case 'event':
        case 'social':
        case 'party':
          return showSocial;
        case 'other':
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
            <label>
              <CheckBox
                id="companyPresentation"
                value={showCompanyPresentation}
                onChange={() =>
                  this.handleFilterEventTypeChange('showCompanyPresentation')
                }
                className={styles.checkbox}
              />
              <span>Bedpres</span>
            </label>
            <label>
              <CheckBox
                id="course"
                value={showCourse}
                onChange={() => this.handleFilterEventTypeChange('showCourse')}
                className={styles.checkbox}
              />
              <span>Kurs</span>
            </label>
            <label>
              <CheckBox
                id="social"
                value={showSocial}
                onChange={() => this.handleFilterEventTypeChange('showSocial')}
                className={styles.checkbox}
              />
              <span>Sosialt</span>
            </label>
            <label>
              <CheckBox
                id="other"
                value={showOther}
                onChange={() => this.handleFilterEventTypeChange('showOther')}
                className={styles.checkbox}
              />
              <span>Annet</span>
            </label>
          </div>
          <Icon
            size={25}
            name="funnel-outline"
            style={{ marginRight: '5px', marginLeft: '10px' }}
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
        {isEmpty(this.props.events) && (
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
