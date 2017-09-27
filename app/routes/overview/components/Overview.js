import styles from './Overview.css';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import Image from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import { Container, Flex } from 'app/components/Layout';
import LatestReadme from './LatestReadme';
import Feed from './Feed';
import CompactEvents from './CompactEvents';
import { EVENT_TYPE_TO_STRING, colorForEvent } from 'app/routes/events/utils';
import Button from 'app/components/Button';

const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 140;
const IMAGE_HEIGHT = 192;

function PrimaryItem({ event }) {
  if (!event) {
    return (
      <Flex column className={styles.primaryItem}>
        <h2 className="u-ui-heading">Pinned event</h2>
        <Flex column className={styles.innerPrimaryItem}>
          <Image
            style={{ height: IMAGE_HEIGHT, display: 'block' }}
            className={styles.image}
            src={'https://i.redd.it/dz8mwvl4dgdy.jpg'}
          />
          <div className={styles.pinnedHeading}>
            <h2 className={styles.itemTitle}>Ingen arrangementer</h2>
          </div>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex column className={styles.primaryItem}>
      <h2 className="u-ui-heading">Pinned Event</h2>
      <Flex column className={styles.innerPrimaryItem}>
        <Link
          to={`/events/${event.id}`}
          style={{ height: IMAGE_HEIGHT, display: 'block' }}
        >
          <Image className={styles.image} src={event.cover} />
        </Link>
        <div className={styles.pinnedHeading}>
          <h2 className={styles.itemTitle}>
            <Link to={`/events/${event.id}`}>{event.title}</Link>
          </h2>

          <span className={styles.itemInfo}>
            {event.startTime && (
              <Time time={event.startTime} format="DD.MM HH:mm" />
            )}
            {event.location !== '-' && (
              <span>
                <span className={styles.dot}> · </span>
                <span>{event.location}</span>
              </span>
            )}
            {event.eventType && (
              <span>
                <span className={styles.dot}> · </span>
                <span>{EVENT_TYPE_TO_STRING(event.eventType)}</span>
              </span>
            )}
          </span>
        </div>
      </Flex>
    </Flex>
  );
}

const OverviewItem = ({ event, showImage }) => (
  <Flex column className={styles.item}>
    <Flex className={styles.inner}>
      <Flex column>
        {showImage && (
          <Link to={`/events/${event.id}`} className={styles.imageContainer}>
            <Image className={styles.image} src={event.cover} />
          </Link>
        )}
      </Flex>
      <Flex column className={styles.innerRight}>
        <div className={styles.heading}>
          <h2 className={styles.itemTitle}>
            <Link to={`/events/${event.id}`}>
              {truncateString(event.title, TITLE_MAX_LENGTH)}
            </Link>
          </h2>

          <span className={styles.itemInfo}>
            {event.startTime && (
              <Time time={event.startTime} format="DD.MM HH:mm" />
            )}
            {event.location !== '-' && (
              <span>
                <span className={styles.dot}> · </span>
                <span>{event.location}</span>
              </span>
            )}
            {event.eventType && (
              <span>
                <span className={styles.dot}> · </span>
                <span>{EVENT_TYPE_TO_STRING(event.eventType)}</span>
              </span>
            )}
          </span>
        </div>

        <p
          className={styles.itemDescription}
          style={{
            borderTop: `3px solid ${colorForEvent(event.eventType)}`
          }}
        >
          {truncateString(event.description, DESCRIPTION_MAX_LENGTH)}
        </p>
      </Flex>
    </Flex>
  </Flex>
);

export default class Overview extends Component {
  state = {
    eventsToShow: 4
  };

  increaseEventsToShow = () => {
    this.setState({ eventsToShow: this.state.eventsToShow * 2 });
  };

  render() {
    const { events, feed, feedItems } = this.props;

    return (
      <Container>
        <Helmet title="Hjem" />
        <Flex wrap style={{ justifyContent: 'space-between' }}>
          <Flex column style={{ flex: 2 }}>
            <CompactEvents events={events} />
            <PrimaryItem event={events[0]} />
          </Flex>
          <Feed style={{ flex: 2 }} feed={feed} feedItems={feedItems} />
        </Flex>
        <Flex />
        <Flex padding={10}>
          <LatestReadme expanded={events.length === 0} />
        </Flex>
        <Flex wrap>
          {events
            .slice(1, this.state.eventsToShow)
            .map(event => (
              <OverviewItem
                key={event.id}
                event={event}
                showImage
                increaseEventsToShow={this.increaseEventsToShow}
              />
            ))}
          {events.length > 0 && (
            <Button
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() =>
                this.setState({ eventsToShow: this.state.eventsToShow ** 2 })}
            >
              Vis flere arrangementer&nbsp;
              <i className="fa fa-angle-double-down " />
            </Button>
          )}
        </Flex>
      </Container>
    );
  }
}
