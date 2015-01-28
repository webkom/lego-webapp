'use strict';

var React = require('react');
var Link = require('react-router').Link;
var EventStore = require('../stores/EventStore');
var EventService = require('../services/EventService');
var EventActionCreators = require('../actions/EventActionCreators');
var EventTimeline = require('./EventTimeline');
var Time = require('./Time');
var Icon = require('./Icon');
var LoadingIndicator = require('./LoadingIndicator');

var FrontPageFeed = React.createClass({

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
      <LoadingIndicator loading={events.length === 0}>
        <div>
          <h2>Aktiviteter denne uken</h2>
          <EventTimeline events={events.slice(0, 4)} />

          <h2>Aktiviteter senere</h2>
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
    );
  }
});

module.exports = FrontPageFeed;
