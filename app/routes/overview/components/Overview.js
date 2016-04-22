import styles from './Overview.css';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';
import Time from 'app/components/Time';
import colorForEvent from 'app/routes/events/colorForEvent';

let id = Math.floor(Math.random() * 1000);
function getImage() {
  return `http://unsplash.it/800/600?image=${id++}`;
}

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
    {showImage && <img className='Overview__item__image' src={getImage()}></img>}
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
    const { events } = this.props;
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
            <div className='Profile'>
              <img className='Profile__avatar' src='http://api.adorable.io/avatars/70/ekmartin.png'></img>
              <div className='Profile__user'>
                <h3>Martin Ek</h3>
                <Icon name='chevron-down' />
              </div>
            </div>

            <div className='Upcoming'>
              <h2>Arrangementer</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
