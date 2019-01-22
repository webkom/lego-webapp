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
import type { Event, ActionGrant } from 'app/models';
import Select from 'react-select';
import { orderBy } from 'lodash';
import Icon from 'app/components/Icon';

const groupEvents = ({
  events,
  field = 'startTime'
}: {
  events: Array<Event>,
  field: string
}) => {
  const nextWeek = moment().add(1, 'week');
  const groups = {
    currentWeek: event => event[field].isSame(moment(), 'week'),
    nextWeek: event => event[field].isSame(nextWeek, 'week'),
    later: event => event[field].isAfter(nextWeek)
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
  events = []
}: {
  name: string,
  field: string,
  events: Array<Event>
}) => {
  return isEmpty(events) ? null : (
    <div className={styles.eventGroup}>
      <h2 className={styles.heading}>{name}</h2>
      {events.map((event, i) => (
        <EventItem key={i} event={event} field={field} />
      ))}
    </div>
  );
};

type EventListProps = {
  events: Array<Event>,
  actionGrant: ActionGrant,
  icalToken: string,
  showFetchMore: boolean,
  fetchMore: () => Promise<*>
};

type Option = {
  value: Event => Event,
  label: string,
  field: string
};

type State = {
  selectedOption: Option
};

// $FlowFixMe
class EventList extends Component<EventListProps, State> {
  state = {
    selectedOption: {
      // $FlowFixMe
      value: event => event,
      label: 'Alle',
      field: 'startTime'
    }
  };

  handleChange = (selectedOption: Option): void => {
    this.setState({ selectedOption });
  };

  render() {
    const { icalToken, showFetchMore, fetchMore, events } = this.props;
    const { field, value } = this.state.selectedOption;

    const groupedEvents = groupEvents({
      events: orderBy(events.filter(value), field),
      field: field
    });

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
            options={[
              {
                value: event => event,
                label: 'Vis alle',
                field: 'startTime'
              },
              {
                value: event => event.activationTime == null,
                label: 'Påmelding åpnet',
                field: 'startTime'
              },
              {
                value: event => event.activationTime !== null,
                label: 'Åpner i fremtiden',
                field: 'activationTime'
              }
            ]}
          />
        </div>
        <EventListGroup
          name="Denne uken"
          events={groupedEvents.currentWeek}
          field={field}
        />
        <EventListGroup
          name="Neste uke"
          events={groupedEvents.nextWeek}
          field={field}
        />
        <EventListGroup
          name="Senere"
          events={groupedEvents.later}
          field={field}
        />

        {isEmpty(this.props.events) && (
          <EmptyState icon="book-outline" size={40}>
            <h2 className={styles.noEvents}>Ingen kommende arrangementer</h2>
          </EmptyState>
        )}
        {showFetchMore && <Button onClick={fetchMore}>Last inn mer</Button>}
        <div className={styles.bottomBorder} />
        <EventFooter icalToken={icalToken} />
      </div>
    );
  }
}

export default EventList;
