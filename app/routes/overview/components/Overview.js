import styles from './Overview.css';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import Time from 'app/components/Time';
import Image from 'app/components/Image';
import colorForEvent from 'app/routes/events/colorForEvent';
import truncateString from 'app/utils/truncateString';
import { getImage } from 'app/utils';
import Carousel from './Carousel';

const EVENT_TYPES = [
  'Bedriftspresentasjon',
  'Kurs',
  'Fest',
  'Annet',
  'Arrangement'
];

const DESCRIPTION_MAX_LENGTH = 150;

const OverviewItem = ({ event, showImage, isHeadline }) => (
  <div
    className={cx(styles.item, isHeadline && styles.halfWidth)}
    style={{
    }}
  >
    {showImage && (
      <Link
        to={`/events/${event.id}`}
        className={styles.imageLink}
        style={{ height: 180 }}
      >
        <Image
          src={getImage(event.id, 400, 180)}
        />
      </Link>
    )}

    <div className={styles.heading}>
      {showImage && (
        <Link to={`/events/${event.id}`} className={styles.imageLink} style={{ height: 180 }}>
          <Image
            src={event.cover}
          />
        </Link>
      )}
      <h2 className={styles.itemTitle}>
        <Link to={`/events/${event.id}`}>
          {event.title}
        </Link>
      </h2>

      <span className={styles.itemInfo}>
        <Time time={event.startTime} format='DD.MM HH:mm' />
        <span> · </span>
        <span>{event.location}</span>
      </span>
    </div>

    <p
      className={styles.itemDescription}
      style={{
        borderBottom: `4px solid ${colorForEvent(event.eventType)}`,
      }}
    >
      {truncateString(event.description, DESCRIPTION_MAX_LENGTH)}
    </p>
  </div>
);

export default class Overview extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    fetchAll: PropTypes.func.isRequired
  };

  render() {
    const { events } = this.props;

    return (
      <ContainerWithSidebar>
        <Carousel
          items={events.slice(0, 5)}
          renderMenuItem={({ item, isActive }) => (
            <div>Event Title {isActive && 'Active'}</div>
          )}
          renderContent={({ item }) => (
            <div>Hello World</div>
          )}
        />
        {events.map((event, index) => (
          <OverviewItem
            key={event.id}
            event={event}
            isHeadline={false}
            showImage
          />
        ))}
      </ContainerWithSidebar>
    );
  }
}


function ContainerWithSidebar({ children, renderSidebar }) {
  return (
    <section className={styles.container}>
      <div className={styles.main}>
        {children}
      </div>
    </section>
  );
}
