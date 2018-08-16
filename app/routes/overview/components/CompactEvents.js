// @flow

import styles from './CompactEvents.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import colorForEvent from 'app/routes/events/colorForEvent';
import truncateString from 'app/utils/truncateString';
import { Flex } from 'app/components/Layout';
import Time from 'app/components/Time';

type Props = {
  events: Array<Object>
};

const TITLE_MAX_LENGTH = 25;

export default class CompactEvents extends Component<Props> {
  render() {
    const { events } = this.props;

    const mapEvents = eventTypes => {
      return events
        .filter(
          event =>
            event.endTime.isAfter() && eventTypes.includes(event.eventType)
        )
        .slice(0, 5)
        .map((event, key) => (
          <li key={key}>
            <span>
              <span
                style={{
                  color: colorForEvent(event.eventType),
                  fontSize: '15px',
                  lineHeight: '0',
                  marginRight: '10px'
                }}
              >
                <i className="fa fa-circle" />
              </span>
              <span>
                <Link to={`/events/${event.id}`}>
                  {truncateString(event.title, TITLE_MAX_LENGTH)}
                </Link>
              </span>
            </span>
            <Time format="dd D.MM" time={event.startTime} />
          </li>
        ));
    };

    const presentations = mapEvents([
      'company_presentation',
      'lunch_presentation',
      'course'
    ]);
    const leftEvents =
      presentations.length > 0 ? presentations : ['Ingen presentasjoner'];

    const other = mapEvents(['other', 'event', 'social', 'party']);
    const rightEvents = other.length > 0 ? other : ['Ingen arrangementer'];

    if (!events.length) {
      return null;
    }
    return (
      <Flex column>
        <Flex wrap className={styles.compactEvents}>
          <Flex column className={styles.compactLeft}>
            <Link to={'/events'}>
              <h3 className="u-ui-heading">Bedpres og Kurs</h3>
            </Link>
            <ul className={styles.innerList}>{leftEvents}</ul>
          </Flex>
          <Flex column className={styles.compactRight}>
            <Link to={'/events'}>
              <h3 className="u-ui-heading">Arrangementer</h3>
            </Link>
            <ul className={styles.innerList}>{rightEvents}</ul>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
