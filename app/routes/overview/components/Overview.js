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

const OverviewItem = ({ event, showImage }) => (
  <div key={event.id} className='Overview__item'>
    <h4 style={{ color: colorForEvent(event.eventType) }} className='Overview__item__type'>
      {EVENT_TYPES[event.eventType]}
    </h4>
    {showImage &&
      <Link to={`/events/${event.id}`}>
        <img className='Overview__item__image' src={getRandomImage(800, 600)}></img>
      </Link>}
    <h2 className='Overview__item__title'>
      <Link to={`/events/${event.id}`}>
        {event.title}
      </Link>
    </h2>

    <span className='Overview__item__moreInfo'>
      <Time time={event.startTime} format='DD.MM HH:mm' />
      <span> - </span>
      <span>{event.location}</span>
    </span>
    <p className='Overview__item__description'>{event.description}</p>
  </div>
);

export default class Overview extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    fetchAll: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired
  };

  render() {
    const { events, user } = this.props;
    return (
      <section className={styles.root}>
        <div className='u-container Frontpage'>
          <div className='Overview'>
            <div className='Overview__headline'>
              {events.slice(0, 2).map((event) => <OverviewItem event={event} showImage />)}
            </div>
            <div className='Overview__normal'>
              {events.slice(2, 5).map((event) => <OverviewItem event={event} />)}
            </div>
          </div>

          <div className='Sidebar'>
            <ProfileBox user={user} />
            <EventSidebar events={events} />
          </div>
        </div>
      </div>
    );
  }
}
