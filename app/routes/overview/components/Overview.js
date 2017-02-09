import styles from './Overview.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import Image from 'app/components/Image';
import colorForEvent from 'app/routes/events/colorForEvent';
import truncateString from 'app/utils/truncateString';
import { Content, Flex } from 'app/components/Layout';
import LatestReadme from './LatestReadme';
import Feed from './Feed';

const DESCRIPTION_MAX_LENGTH = 150;
const IMAGE_HEIGHT = 180;

function PrimaryItem({ event }) {
  return (
    <Flex column className={styles.primaryItem}>
      <h2 className='u-ui-heading'>Pinned Event</h2>
      <Flex column className={styles.innerPrimaryItem}>
        <Link
          to={`/events/${event.id}`}
          style={{ height: IMAGE_HEIGHT, display: 'block' }}
        >
          <Image
            className={styles.image}
            src={event.cover}
          />
        </Link>
        <div className={styles.pinnedHeading}>
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
      </Flex>
    </Flex>
  );
}

const OverviewItem = ({ event, showImage }) => (
  <Flex
    column
    className={styles.item}
  >
    <Flex column className={styles.inner}>
      {showImage && (
        <Link
          to={`/events/${event.id}`}
          style={{ height: IMAGE_HEIGHT, display: 'block' }}
        >
          <Image
            className={styles.image}
            src={event.cover}
          />
        </Link>
      )}

      <div className={styles.heading}>
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
          borderTop: `3px solid ${colorForEvent(event.eventType)}`,
        }}
      >
        {truncateString(event.description, DESCRIPTION_MAX_LENGTH)}
      </p>
    </Flex>
  </Flex>
);

export default class Overview extends Component {
  render() {
    const { events } = this.props;

    if (!events.length) {
      return null;
    }

    return (
      <Content>
        <Flex>
          <PrimaryItem
            event={events[0]}
          />
          <Feed />
        </Flex>
        <Flex padding={10}>
          <LatestReadme />
        </Flex>
        <Flex wrap>
          {events.slice(1).map((event) => (
            <OverviewItem
              key={event.id}
              event={event}
              showImage
            />
          ))}
        </Flex>
      </Content>
    );
  }
}
