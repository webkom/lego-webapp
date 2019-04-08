// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NextEvent.css';
import { colorForEvent } from 'app/routes/events/utils';
import { Flex } from 'app/components/Layout';
import type { Event } from 'app/models';
import { Image } from 'app/components/Image';
import alarm from 'app/assets/alarm.svg';
import truncateString from 'app/utils/truncateString';
import { orderBy } from 'lodash';
import moment from 'moment-timezone';
import Icon from 'app/components/Icon';
import Tooltip from 'app/components/Tooltip';

type Props = {
  event: Event
};

type State = {
  time: string
};

class EventItem extends React.Component<Props, State> {
  state = {
    time: EventItem.generateTime(this.props)
  };
  interval: IntervalID;

  static generateTime(props: Props) {
    const now = moment();
    const start = moment(props.event && props.event.activationTime);
    const time = now.to(start);

    // If it's 1 day left we would like to say 'i morgen' and not 1 day
    const isTomorrow = moment()
      .add('1', 'day')
      .isSame(start, 'day');
    return isTomorrow ? 'i morgen' : time;
  }

  updateTime(props) {
    this.setState({
      time: EventItem.generateTime(this.props)
    });
  }

  componentDidMount() {
    this.updateTime();
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const selected = this.props.event;
    const activeString = moment(selected.activationTime).format('LLLL');
    return (
      <Tooltip content={`Påmelding: ${activeString}`}>
        <Flex
          column
          style={{ borderColor: colorForEvent(selected.eventType) }}
          className={styles.eventItem}
        >
          <Link to={`/events/${selected.id}`} className={styles.title}>
            <h4>{truncateString(selected.title, 43)}</h4>
          </Link>

          <div className={styles.info}>
            <span>
              <Image className={styles.alarm} src={alarm} />
            </span>
            <span style={{ color: 'grey' }}>
              Påmelding {/*Change based on time*/}
              {moment().isBefore(selected.activationTime) ? 'åpner' : 'åpnet'}
            </span>
            <span className={styles.time}>
              {/*Add for if the moment has passed*/}
              {moment().isAfter(selected.activationTime) && 'for '}
              {/*Minutter is too long of string*/}
              {this.state.time.replace('minutter', 'min')}
            </span>
          </div>
        </Flex>
      </Tooltip>
    );
  }
}

// Component when there is no events
const Filler = () => (
  <Flex column className={styles.filler}>
    <Icon size={40} name="eye-off-outline" style={{ marginRight: '5px' }} />
    <span>Ingen påmeldinger de neste 3 dagene </span>
  </Flex>
);

// Filter for activation
const hasActivation = event => event.activationTime !== null;

// Filter for range
const inRange = event => {
  const start = moment(event && event.activationTime);
  return (
    // Check that the date is within 3 days
    start.isSameOrBefore(moment().add(3, 'days'), 'day') &&
    // Check that the date is the same day
    start.isSameOrAfter(moment(), 'day')
  );
};

const NextEvent = (props: { events: Array<Event> }) => {
  // This will prevent the filler from rendering in the
  // split second where events have not loaded
  if (props.events.length == 0) return null;

  // Sorted events based on activationfilter take out the
  // ones that are out of range
  const orderedEvents = orderBy(
    props.events.filter(hasActivation).filter(inRange),
    ['activationTime']
  ).splice(0, 2);

  return (
    <div className={styles.wrapper}>
      {orderedEvents.length > 0 ? (
        orderedEvents.map(e => <EventItem key={e.id} event={e} />)
      ) : (
        <Filler />
      )}
    </div>
  );
};

export default NextEvent;
