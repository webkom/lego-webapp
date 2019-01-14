// @flow

import React from 'react';
import { Link } from 'react-router';
import styles from './NextEvent.css';
import colorForEvent from 'app/routes/events/colorForEvent';
import { Image } from 'app/components/Image';
import moment from 'moment-timezone';

function getTimeDifference(first: moment, second: moment): number {
  return moment(first).diff(moment(second));
}

type Props = {
  event: Object
};

const EventItem = (props: Props) => {
  const selected = props.event;
  const a = getTimeDifference(selected && selected.activationTime, moment());
  const time = moment(a).format('HH:mm:ss');

  return (
    <div
      style={{ borderColor: colorForEvent(selected && selected.eventType) }}
      className={styles.eventItem}
    >
      <Link to={`/events/${selected.id}`} className={styles.title}>
        <h4>{selected.title}</h4>
      </Link>

      <div className={styles.info}>Åpner om</div>

      <div className={styles.time}>{time}</div>

      <div className={styles.image}>
        {selected.cover && <Image src={selected.cover} />}
      </div>
    </div>
  );
};

const NextEvent = (props: { events: Array<any> }) => {
  return (
    <div className={styles.root}>
      <EventItem event={props.events[8]} />
    </div>
  );
};

export default NextEvent;
