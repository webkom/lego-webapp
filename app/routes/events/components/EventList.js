// @flow

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import moment from 'moment-timezone';
import Button from 'app/components/Button';
import EventItem from 'app/components/EventItem';
import Toolbar from './Toolbar';
import styles from './EventList.css';
import EventFooter from './EventFooter';
import EmptyState from 'app/components/EmptyState';
import { isEmpty } from 'lodash';
import type { Event, ActionGrant, IcalToken, EventTimeType } from 'app/models';
import Select from 'react-select';
import { orderBy } from 'lodash';
import Icon from 'app/components/Icon';
import { EVENTFIELDS } from 'app/utils/constants';

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
  filterFunc: (Event) => boolean,
  label: string,
  field: EventTimeType,
};

type State = {
  selectedOption: Option,
};

// $FlowFixMe
class EventList extends Component<EventListProps, State> {
  state = {
    selectedOption: {
      filterFunc: (event: Event) => event,
      label: 'Vis alle',
      field: EVENTFIELDS.start,
    },
  };

  handleChange = (selectedOption: Option): void => {
    this.setState({ selectedOption });
  };

  render() {
    const {
      icalToken,
      showFetchMore,
      fetchMore,
      events,
      loggedIn,
    } = this.props;
    const { field, filterFunc } = this.state.selectedOption;

    const groupedEvents = groupEvents({
      events: orderBy(events.filter(filterFunc), field),
      field: field,
    });

    const options = [
      {
        filterFunc: (event) => event,
        label: 'Vis alle',
        field: EVENTFIELDS.start,
      },
      {
        filterFunc: (event) =>
          event.activationTime != null &&
          event.activationTime.isBefore(moment()),
        label: 'Påmelding åpnet',
        field: EVENTFIELDS.start,
      },
      {
        filterFunc: (event) =>
          event.activationTime != null &&
          event.activationTime.isAfter(moment()),
        label: 'Åpner i fremtiden',
        field: EVENTFIELDS.activate,
      },
    ];

    return (
      <div className={styles.root}>
        <Helmet title="Arrangementer" />
        <Toolbar actionGrant={this.props.actionGrant} />
        <div className={styles.filter}>
          <Icon
            size={25}
            name="funnel-outline"
            style={{ marginRight: '5px' }}
          />
          <Select
            name="form-field-name"
            value={this.state.selectedOption}
            onChange={this.handleChange}
            className={styles.select}
            options={options}
            clearable={false}
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
        {showFetchMore && field == 'startTime' && (
          <Button onClick={fetchMore}>Last inn mer</Button>
        )}
        <div className={styles.bottomBorder} />
        <EventFooter icalToken={icalToken} />
      </div>
    );
  }
}

export default EventList;
