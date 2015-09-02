import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

let id = 0;
function getImage() {
  return 'http://lorempixel.com/800/400?' + (id++);
}

export default class Overview extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired
  }

  static defaultProps = {
    events: []
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
              <Link className='UpcomingEvents-item' to='events' params={{ eventId: event.id }} style={{background: `url(${getImage()})`}}>
                <strong>{event.name}</strong>
              </Link>
            )}
          </div>

          <div className='news'>
            <h2 className='u-heading-with-bar'>Nyheter på tegnspråk</h2>
            {events.slice(5).map((event) =>
              <div key={event.id}>
                {event.name}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}
