// @flow

import styles from './EventSidebar.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Octagon from 'app/components/Octagon';
import { Image } from 'app/components/Image';
import { colorForEvent } from 'app/routes/events/utils';
import type { Event } from 'app/models';

type EventItemProps = {
  event: Event,
  imageSize: number | string
};

const EventItem = ({ event, imageSize }: EventItemProps) => (
  <Link to={`/events/${event.id}`}>
    <li className={styles.item} key={event.id}>
      <Octagon size={imageSize}>
        <Image
          style={{
            paddingBottom: 15
          }}
          src={event.thumbnail}
        />
      </Octagon>
      <div>
        <h3
          className={styles.itemTitle}
          style={{ color: colorForEvent(event.eventType) }}
        >
          {event.title}
        </h3>
      </div>
    </li>
  </Link>
);

type EventSidebarProps = {
  events: Array<Event>
};

// TODO: Only show events from the next 14 days under "Kommende"
const EventSidebar = ({ events }: EventSidebarProps) => (
  <div className={styles.eventSidebar}>
    <h2>Arrangementer</h2>
    <div className={`${styles.events}`}>
      <h3>Kommende</h3>
      {events.slice(0, 3).map(event => (
        <EventItem key={event.id} imageSize="30px" event={event} />
      ))}
    </div>
  </div>
);

export default EventSidebar;
