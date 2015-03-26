import React from 'react';
import {Link} from 'react-router';
import Icon from './Icon';
import SidebarBlock from './SidebarBlock';
import LoadingIndicator from './LoadingIndicator';
import EventTimeline from './EventTimeline';
import Favorites from './Favorites';
import FavoritesStore from '../stores/FavoritesStore';
import FavoritesService from '../services/FavoritesService';
import FavoritesActions from '../actions/FavoritesActions';
import EventStore from '../stores/EventStore';
import UserStore from '../stores/UserStore';
import * as EventService from '../services/EventService';
import EventActions from '../actions/EventActions';

function findEvents() {
  EventService.findAll()
    .then((events) => {
      EventActions.receiveAll(events);
    });
}

var Overview = React.createClass({

  getInitialState() {
    return EventStore.getState();
  },

  componentDidMount() {
    EventStore.addChangeListener(this.update);
    UserStore.addChangeListener(findEvents);
    findEvents();
  },

  componentWillUnmount() {
    EventStore.removeChangeListener(this.update);
    UserStore.removeChangeListener(findEvents);
  },

  update() {
    this.setState(EventStore.getState());
  },

  render() {
    var events = this.state.events;
    return (
      <section>
        <div className='content'>
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

          <LoadingIndicator loading={events.length === 0}>
            <div className='feed-container'>
              <h2 className='inside-feed'>På plakaten</h2>
              <div className='event-grid'>
                {events.map(function(event) {
                  return (
                    <Link to='event' params={{eventId: event.id}} key={event.id} className={'feed-event-box ' + event.type}>
                      <article>
                        <div><img src={Math.random() > 0.5 ? 'https://s3.amazonaws.com/f.cl.ly/items/411l1P330u2X0M3P3D0q/Skjermbilde%202015-01-30%20kl.%2017.27.53.png' : 'http://himmelpartner.no/wp-content/uploads/2013/09/L%C3%A5vefest31-08-2013-3869.jpg'} /></div>
                        <div>
                          <h3>{event.title}</h3>
                          {event.ingress}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>
          </LoadingIndicator>
        </div>
      </section>
    );
  }
});

export default Overview;
