// @flow

import React from 'react';
import { Link } from 'react-router';
import styles from './NextEvent.css';
import colorForEvent from 'app/routes/events/colorForEvent';
import moment from 'moment-timezone';
import { Flex } from 'app/components/Layout';
import type { Event } from 'app/models';
import { Image } from 'app/components/Image';
import alarm from 'app/assets/alarm.svg';
import truncateString from 'app/utils/truncateString';

type Props = {
  event: Event
};

class EventItem extends React.Component<Props, *> {
  constructor(props) {
    super(props);
    this.state = {
      hours: '00',
      min: '00',
      sec: '00'
    };
  }

  setTime(props) {
    let now = moment();
    let start = moment(props.event && props.event.activationTime);
    let duration = start.diff(now);
    let sec = parseInt((duration / 1000) % 60);
    let min = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    this.setState({
      hours: hours,
      min: min,
      sec: sec
    });
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setTime(this.props), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const selected = this.props.event;
    return (
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
          <span style={{ color: 'grey' }}>Påmelding åpner om</span>
          <span className={styles.time}>
            {this.state.hours} : {this.state.min} : {this.state.sec}
          </span>
        </div>
      </Flex>
    );
  }
}

const NextEvent = (props: { events: Array<Event> }) => {
  return (
    <div className={styles.root}>
      {props.events[2] && <EventItem event={props.events[2]} />}
      {props.events[4] && <EventItem event={props.events[4]} />}
    </div>
  );
};

export default NextEvent;
