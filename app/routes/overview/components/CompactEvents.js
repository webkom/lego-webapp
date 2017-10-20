import styles from './CompactEvents.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import colorForEvent from 'app/routes/events/colorForEvent';
import truncateString from 'app/utils/truncateString';
import { Flex } from 'app/components/Layout';
import Time from 'app/components/Time';
import moment from 'moment';

type Props = {
  events: Array<Object>
};

const TITLE_MAX_LENGTH = 25;

export default class CompactEvents extends Component {
  props: Props;

  render() {
    const { events } = this.props;

    const mapEvents = eventTypes => {
      return events
        .sort((a, b) => a.startTime - b.startTime)
        .filter(
          event =>
            event.startTime > moment.now() &&
            eventTypes.indexOf(event.eventType) !== -1
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

    const leftEvents = mapEvents([
      'company_presentation',
      'lunch_presentation',
      'course'
    ]);

    const rightEvents = mapEvents(['other', 'event']);

    if (!events.length) {
      return null;
    }
    return (
      <Flex column>
        <Flex wrap className={styles.compactEvents}>
          <Flex column className={styles.compactLeft}>
            <h3 className="u-ui-heading">Bedriftspresentasjoner</h3>
            <ul className={styles.innerList}>{leftEvents}</ul>
          </Flex>
          <Flex column className={styles.compactRight}>
            <h3 className="u-ui-heading">Arrangementer</h3>
            <ul className={styles.innerList}>{rightEvents}</ul>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}
