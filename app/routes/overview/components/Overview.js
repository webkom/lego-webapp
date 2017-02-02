import styles from './Overview.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import Time from 'app/components/Time';
import Image from 'app/components/Image';
import Card from 'app/components/Card';
import colorForEvent from 'app/routes/events/colorForEvent';
import truncateString from 'app/utils/truncateString';
import { getImage } from 'app/utils';
import { Content, Flex } from 'app/components/Layout';

const DESCRIPTION_MAX_LENGTH = 150;
const IMAGE_HEIGHT = 180;

const OverviewItem = ({ event, showImage, isHeadline = false }) => (
  <Flex
    column
    className={cx(styles.item, isHeadline && styles.halfWidth)}
  >
    {showImage && (
      <Link
        to={`/events/${event.id}`}
        style={{ height: IMAGE_HEIGHT, display: 'block' }}
      >
        <Image
          src={getImage(event.id, 400, IMAGE_HEIGHT)}
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
        <OverviewItem
          isHeadline
          event={events[0]}
        />

        <Flex wrap padding={10}>
          <Card>
            Hello dude what is going on
          </Card>

          <Card dark>
            <p>Hello World</p>
          </Card>

          <Card dark>
            <p>Hello World</p>
          </Card>

          <Card>
            <p>Hello World</p>
          </Card>

          <Card dark>
            <p>Hello World</p>
          </Card>

          <Card dark>
            <p>Hello World</p>
          </Card>

          <Card dark>
            <p>Hello World</p>
          </Card>
        </Flex>

        <Flex wrap>
          {events.slice(1).map((event) => (
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
