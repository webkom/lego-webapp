import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from './Icon';
import Loader from './Loader';
import EventTimeline from './EventTimeline';
import Favorites from './Favorites';
import SidebarBlock from './SidebarBlock';

export default class Overview extends Component {

  static defaultProps = {
    events: []
  }

  render() {
    const { events } = this.props;
    return (
      <section>
        <div className='u-container'>
          <h2 className='inside-feed'>Kommende aktiviteter</h2>
          <EventTimeline events={events.slice(0, 5)} />

          <div className='sidebar'>
            <SidebarBlock title='Mine arrangementer'>
              <Favorites />
            </SidebarBlock>

            <SidebarBlock title='Interessegrupper'>
              <p>Du er ikke medlem av noen interessegrupper.</p>
              <p><a>Finn noen som passer deg &rarr;</a></p>
            </SidebarBlock>

            <SidebarBlock title='Live feed'>
              <ul className='live-feed'>
                <li><Icon name='user' /> Syll er i venteliste på Låvefest</li>
                <li><Icon name='beer' /> Ek meldte seg på Låvefest</li>
                <li><Icon name='flag' /> Påmelding åpnet for Låvefest</li>
                <li><Icon name='clock-o' /> Bedpress Steria om 15 min</li>
              </ul>
            </SidebarBlock>
          </div>

          <Loader loading={events.length === 0}>
            <div className='feed-container'>
              <h2 className='inside-feed'>På plakaten</h2>
              <div className='event-grid'>
                {events.slice(4).map(function(event) {
                  return (
                    <Link to='event' params={{eventId: event.id}} key={event.id} className={'feed-event-box ' + event.type}>
                      <article>
                        <div><img src={Math.random() > 0.5 ? 'https://s3.amazonaws.com/f.cl.ly/items/411l1P330u2X0M3P3D0q/Skjermbilde%202015-01-30%20kl.%2017.27.53.png' : 'http://himmelpartner.no/wp-content/uploads/2013/09/L%C3%A5vefest31-08-2013-3869.jpg'} /></div>
                        <div>
                          <h3>{event.name}</h3>
                          {event.description.slice(0, 200)}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Loader>
        </div>
      </section>
    );
  }
}
