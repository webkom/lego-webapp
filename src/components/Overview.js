import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

let id = 0;
function getImage() {
  return 'http://lorempixel.com/800/400?' + (id++);
}

export default class Overview extends Component {

  static propTypes = {
    events: PropTypes.array.isRequired,
    fetchAll: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired
  }

  static defaultProps = {
    events: []
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
              className='UpcomingEvents-item'
              to='events'
              params={{ eventId: event.id }}
              style={{background: `url(${getImage()})`}}>
                <strong>{event.title}</strong>
              </Link>
            )}
          </div>

          <div className='news'>
            <h2 className='u-heading-with-bar'>Nyheter på tegnspråk</h2>
            {events.map((event) =>
              <div key={event.id}>
                {event.title}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}
