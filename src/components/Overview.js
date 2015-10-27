import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Icon, Time } from './ui';

let id = 0;
function getImage() {
  return 'http://lorempixel.com/800/400?' + (id++);
}

const colors = ['#A1C34A', '#52B0EC', '#E8953A', '#B11C11', '#11111'];

export default class Overview extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    fetchAll: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired
  }

  componentWillMount() {
    this.props.fetchAll();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.loggedIn && nextProps.loggedIn) {
      this.props.fetchAll();
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.events.length !== nextProps.events.length;
  }

  render() {
    const { events } = this.props;
    return (
      <section>
        <div className='u-container'>
          <div className='UpcomingEvents'>
            {events.slice(0, 5).map(event =>
              <Link
                key={event.id}
                className='UpcomingEvents__item'
                to='events'
                params={{ eventId: event.id }}
                style={{ background: `url(${getImage()})` }}
              >
                <span
                  className='UpcomingEvents__item__title'
                  style={{
                    borderBottom: `6px solid ${colors[event.eventType]}`
                  }}>{event.title}
                </span>

                <div className='UpcomingEvents__item__moreInfo'>
                  <Icon name='clock-o' />&nbsp;<Time time={event.starts_at} format='DD.MM HH:mm' />&nbsp;
                  <Icon name='map-marker' />&nbsp;<span>{event.location}</span>
                </div>
              </Link>
            )}
          </div>

          <div className='news'>
            <h2 className='u-heading-with-bar'>Nyheter på tegnspråk</h2>
            {events.map((event) =>
              <div key={event.id}>
                <Link to={`/events/${event.id}`}>{event.title} - {event.ingress}</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}
