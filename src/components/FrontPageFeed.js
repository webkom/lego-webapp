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

function getState() {
  return {
    events: EventStore.getAllSorted(),
  };
}

var FrontPageFeed = React.createClass({

  getInitialState: function() {
    return getState();
  },

  _onChange: function() {
    this.setState(getState());
  },

  componentDidMount: function() {
    EventStore.addChangeListener(this._onChange);
    EventService.findAll(function(err, events) {
      if (err) return;
      EventActionCreators.receiveAll(events);
    });
  },

  componentWillUnmount: function() {
    EventStore.removeChangeListener(this._onChange);
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
