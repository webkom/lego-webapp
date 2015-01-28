'use strict';

var React = require('react');
var Link = require('react-router').Link;
var Icon = require('./Icon');
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
          <EventTimeline events={events.slice(0, 4)} />

          <div className='sidebar'>
            <SidebarBlock title='Mine arrangementer'>
              <Favorites />
            </SidebarBlock>

            <SidebarBlock title='Interessegrupper'>
              <p>Du er ikke medlem av noen interessegrupper.</p>
              <p><a>Finn noen som passer deg &rarr;</a></p>
            </SidebarBlock>

            <SidebarBlock title='Nyeste README'>
              <img src='http://readme.abakus.no/bilder/14/2014-03.jpg' />
            </SidebarBlock>

            <SidebarBlock title='Komitéene'>
              <p>Hello World</p>
            </SidebarBlock>
          </div>

          <LoadingIndicator loading={events.length === 0}>
            <div className='feed-container'>
              <div className='event-grid'>
                {events.slice(4).map(function(event) {
                  return (
                    <Link to='event' params={{eventId: event.id}} key={event.id} className={'feed-event-box ' + event.type}>
                      <h3>{event.name}</h3>
                      {event.description.slice(0, 140)}
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
