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

  state = {
    eventsToShow: 5
  };

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
        .slice(0, this.state.eventsToShow)
        .map((event, key) =>
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
                <i className="fa fa-circle" />{' '}
              </span>
              <span>
                <Link to={`/events/${event.id}`}>
                  {truncateString(event.title, TITLE_MAX_LENGTH)}
                </Link>
              </span>
            </span>
            <span>
              {Time({ format: 'dd d.MM', time: event.startTime._i })}
            </span>
          </li>
        );
    };

    const leftEvents = mapEvents([
      'company_presentation',
      'lunch_presentation'
    ]);

    const rightEvents = mapEvents(['other', 'event']);

    if (!events.length) {
      return null;
    }
    return (
      <Flex wrap column>
        <Flex wrap className={styles.compactEvents}>
          <Flex column className={styles.compactLeft}>
            <h3 className="u-ui-heading">Bedriftspresentasjoner</h3>
            <ul className={styles.innerList}>
              {leftEvents}
            </ul>
          </Flex>
          <Flex column className={styles.compactRight}>
            <h3 className="u-ui-heading">Arrangementer</h3>
            <ul className={styles.innerList}>
              {rightEvents}
            </ul>
          </Flex>
        </Flex>
        <div style={{ margin: '0 auto' }}>
          <a
            style={{ marginRight: '10px' }}
            onClick={() =>
              this.setState({ eventsToShow: this.state.eventsToShow + 5 })}
          >
            Vis flere <i className="fa fa-angle-double-down " />
          </a>
          {this.state.eventsToShow > 5 &&
            <a onClick={() => this.setState({ eventsToShow: 5 })}>
              Vis færre <i className="fa fa-angle-double-up " />
            </a>}
        </div>
      </Flex>
    );
  }
}
