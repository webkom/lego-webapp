// @flow

import React from 'react';
import { Link } from 'react-router';
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

class EventItem extends React.Component<Props, *> {
  state = {
    time: ''
  };
  interval: IntervalID;

  setTime(props) {
    moment.locale('no');
    let now = moment();
    let start = moment(props.event && props.event.activationTime);
    let time = now.to(start);
    const isTomorrow = moment()
      .add('1', 'day')
      .isSame(start, 'day');
    this.setState({
      time: isTomorrow ? 'i morgen' : time
    });
  }

  componentDidMount() {
    this.setTime(this.props);
    this.interval = setInterval(() => this.setTime(this.props), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const selected = this.props.event;
    const activeString = moment(selected.activationTime).format('LLLL');
    return (
      <Tooltip content={activeString}>
        <Flex
          column
          title={`Påmelding: ${activeString}`}
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
              Påmelding{' '}
              {moment().isBefore(selected.activationTime) ? 'åpner' : 'åpnet'}
            </span>
            <span className={styles.time}>
              {moment().isAfter(selected.activationTime) && 'for '}
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
const hasActivation = event => typeof event['activationTime'] !== 'object';

// Filter for range
const inRange = event => {
  const start = moment(event && event.activationTime);
  return (
    start.isSameOrBefore(moment().add(3, 'days'), 'day') &&
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
    <div style={{ minHeight: '140px' }}>
      {orderedEvents.length > 0 ? (
        orderedEvents.map(e => <EventItem key={e.id} event={e} />)
      ) : (
        <Filler />
      )}
    </div>
  );
};

export default NextEvent;
