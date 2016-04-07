import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';
import Time from 'app/components/Time';
import colorForEvent from 'app/routes/events/colorForEvent';

let id = 0;
function getImage() {
  return `http://lorempixel.com/800/400?${id++}`;
}

export default class Overview extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    fetchAll: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired
  };

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
            {events.slice(0, 5).map((event) =>
              <Link
                key={event.id}
                className='UpcomingEvents__item'
                to={`/events/${event.id}`}
                params={{ eventId: event.id }}
                style={{ background: `url(${getImage()})` }}
              >
                <span
                  className='UpcomingEvents__item__title'
                  style={{
                    borderBottom: `6px solid ${colorForEvent(event.eventType)}`
                  }}
                >
                  {event.title}
                </span>

                <div className='UpcomingEvents__item__moreInfo'>
                  <Icon name='clock-o' />&nbsp;
                  <Time time={event.startTime} format='DD.MM HH:mm' />&nbsp;
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
