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

type Props = {
  event: Event
};

class EventItem extends React.Component<Props, *> {
  constructor(props) {
    super(props);
    this.state = {
      time: ''
    };
  }

  setTime(props) {
    moment.locale('no');
    let now = moment();
    let start = moment(props.event && props.event.activationTime);
    let duration = parseInt(start.diff(now));
    let sec = parseInt((duration / 1000) % 60);
    let min = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt(duration / (1000 * 60 * 60));

    hours = hours < 10 ? '0' + hours : hours;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    hours = parseInt(hours);
    if (hours < 1) {
      this.setState({
        time: `${min}min ${sec}sec`
      });
    } else if (hours < 24) {
      this.setState({
        time: `${hours}t ${min}min`
      });
    } else if (hours >= 24 && hours < 48) {
      this.setState({
        time: '1 dag'
      });
    } else if (hours >= 48 && hours < 72) {
      this.setState({
        time: '2 dager'
      });
    } else if (hours >= 72 && hours < 96) {
      this.setState({
        time: '3 dager'
      });
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setTime(this.props), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const selected = this.props.event;
    const activeString = moment(selected.activationTime).format('LLLL');
    return (
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
          <span style={{ color: 'grey' }}>Påmelding åpner om</span>
          <span className={styles.time}>{this.state.time}</span>
        </div>
      </Flex>
    );
  }
}

// Only include evnets within 3 days of right now
function inRange(event) {
  let now = moment();
  let start = moment(event && event.activationTime);
  let diff = start.diff(now) / 1000;
  return diff < 345600 && diff > 0;
}

const NextEvent = (props: { events: Array<Event> }) => {
  // If activationTime is not set it will be 'null', which is an object
  const activationFilter = o => typeof o['activationTime'] !== 'object';
  const orderedEvents =
    props &&
    orderBy(props.events.filter(activationFilter).filter(inRange), [
      'activationTime'
    ])
      .slice(0, 2)
      .map(e => <EventItem key={e.id} event={e} />);
  const filler = (
    <Flex column className={styles.filler}>
      <Icon size={40} name="eye-off-outline" style={{ marginRight: '5px' }} />
      <span>Ingen påmeldinger de neste 3 dagene </span>
    </Flex>
  );

  const output = orderedEvents.length > 0 ? orderedEvents : filler;
  return <div style={{ minHeight: '140px' }}>{output}</div>;
};

export default NextEvent;
