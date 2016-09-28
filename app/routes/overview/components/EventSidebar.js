import styles from './EventSidebar.css';
import React from 'react';
import { Link } from 'react-router';
import Octagon from 'app/components/Octagon';
import colorForEvent from 'app/routes/events/colorForEvent';
import { getRandomImage } from 'app/utils';

const EventItem = ({ event, imageSize }) => (
  <Link to={`/events/${event.id}`}>
    <li className={styles.item} key={event.id}>
      <Octagon size={imageSize}>
        <img className={styles.itemImage} src={getRandomImage(100)}></img>
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

// TODO: Only show events from the next 14 days under "Kommende"
const EventSidebar = ({ events }) => (
  <div className={styles.eventSidebar}>
    <h2>Arrangementer</h2>
    <div className={`${styles.events}`}>
      <h3>Kommende</h3>
      {events.slice(0, 3).map((event) => (
        <EventItem
          key={event.id}
          imageSize='30px'
          event={event}
        />
      ))}
    </div>
    <div className={`${styles.events} ${styles.later}`}>
      <h3>Videre</h3>
      {events.slice(3).map((event) => (
        <EventItem
          key={event.id}
          imageSize='25px'
          event={event}
        />
      ))}
    </div>
  </div>
);

export default EventSidebar;
