import styles from './Overview.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import Time from 'app/components/Time';
import Image from 'app/components/Image';
import Card from 'app/components/Card';
import colorForEvent from 'app/routes/events/colorForEvent';
import truncateString from 'app/utils/truncateString';
import { Content, Flex } from 'app/components/Layout';

const DESCRIPTION_MAX_LENGTH = 150;
const IMAGE_HEIGHT = 180;

const OverviewItem = ({ event, showImage, isHeadline = false }) => (
  <Flex
    column
    className={cx(styles.item, isHeadline && styles.halfWidth)}
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
          borderTop: `2px solid ${colorForEvent(event.eventType)}`,
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
        <Flex wrap>
          {events.map((event) => (
            <OverviewItem
              key={event.id}
              event={event}
              isHeadline
              showImage
            />
          ))}
        </Flex>
      </Content>
    );
  }
}
