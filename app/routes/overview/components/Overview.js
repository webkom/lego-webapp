import styles from './Overview.css';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import EventSidebar from './EventSidebar';
import ProfileBox from './ProfileBox';
import colorForEvent from 'app/routes/events/colorForEvent';
import { getRandomImage } from 'app/utils';

const EVENT_TYPES = [
  'Bedriftspresentasjon',
  'Kurs',
  'Fest',
  'Annet',
  'Arrangement'
];

const HEADLINE_EVENTS = 2;
const FRONT_EVENTS = 5;

const OverviewItem = ({ event, showImage }) => (
  <div className={styles.item}>
    <h4 style={{ color: colorForEvent(event.eventType) }} className={styles.itemType}>
      {EVENT_TYPES[event.eventType]}
    </h4>
    {showImage &&
      <Link to={`/events/${event.id}`}>
        <img className={styles.itemImage} src={getRandomImage(800, 600)}></img>
      </Link>}
    <h2 className={styles.itemTitle}>
      <Link to={`/events/${event.id}`}>
        {event.title}
      </Link>
    </h2>

    <span className={styles.itemInfo}>
      <Time time={event.startTime} format='DD.MM HH:mm' />
      <span> - </span>
      <span>{event.location}</span>
    </span>
    <p className={styles.itemDescription}>{event.description}</p>
  </div>
);

export default class Overview extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    fetchAll: PropTypes.func.isRequired
  };

  render() {
    const { events } = this.props;
    const headlineEvents = events.slice(0, HEADLINE_EVENTS);
    const normalEvents = events.slice(HEADLINE_EVENTS, FRONT_EVENTS);

    return (
      <section className={`u-container ${styles.frontpage}`}>
        <div className={styles.overview}>
          <div className={styles.headline}>
            {headlineEvents.map((event) => <OverviewItem key={event.id} event={event} showImage />)}
          </div>
          <div className={styles.normal}>
            {normalEvents.map((event) => <OverviewItem key={event.id} event={event} />)}
          </div>
        </div>

        <div className={styles.sidebar}>
          <ProfileBox
            currentUser={this.props.currentUser}
            loggedIn={this.props.loggedIn}
            login={this.props.login}
            logout={this.props.logout}
          />
          <EventSidebar events={events} />
        </div>
      </section>
    );
  }
}
