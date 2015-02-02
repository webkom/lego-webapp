'use strict';

var React = require('react');
var Link = require('react-router').Link;
var Icon = require('./Icon');
var Time = require('./Time');
var SidebarBlock = require('./SidebarBlock');
var LoadingIndicator = require('./LoadingIndicator');
var EventTimeline = require('./EventTimeline');
var Favorites = require('./Favorites');
var FavoritesStore = require('../stores/FavoritesStore');
var FavoritesService = require('../services/FavoritesService');
var FavoritesActionCreators = require('../actions/FavoritesActionCreators');
var EventStore = require('../stores/EventStore');
var EventService = require('../services/EventService');
var EventActionCreators = require('../actions/EventActionCreators');

var Overview = React.createClass({

  mixins: [EventStore.mixin()],

  componentDidMount: function() {
    EventService.findAll(function(err, events) {
      if (err) return;
      EventActionCreators.receiveAll(events);
    });
  },

  render: function() {
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
                {events.slice(4).map(function(event) {
                  return (
                    <Link to='event' params={{eventId: event.id}} key={event.id} className={'feed-event-box ' + event.type}>
                      <article>
                        <div>
                          <img src={Math.random() > 0.5 ? 'https://s3.amazonaws.com/f.cl.ly/items/411l1P330u2X0M3P3D0q/Skjermbilde%202015-01-30%20kl.%2017.27.53.png' : 'http://himmelpartner.no/wp-content/uploads/2013/09/L%C3%A5vefest31-08-2013-3869.jpg'} />
                        </div>
                        <div>
                          <div className='description'>
                            <h3>{event.name}</h3>
                            {event.description.slice(0, 200)}
                          </div>
                          <div className='event-time' style={{backgroundColor: event.color}}>
                            <div className='time'>
                              <Icon name='clock-o' /> <Time time={event.starts_at} format='DD/MM, HH:mm' />
                            </div>
                            <div className='location'>
                              <Icon name='map-marker' /> H3, Hovedbygget
                            </div>
                          </div>
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

module.exports = Overview;
