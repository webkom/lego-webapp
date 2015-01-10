'use strict';

var React = require('react');
var Link = require('react-router').Link;
var EventStore = require('../stores/EventStore');
var EventService = require('../services/EventService');
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
    if (EventStore.isEmpty()) EventService.getAllEvents();
  },

  componentWillUnmount: function() {
    EventStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var events = this.state.events;
    return (
      <LoadingIndicator loading={events.length === 0}>
        <div>
          <div className='feed-events'>
          {events.slice(0, 4).map(function(event) {
            return (
              <Link to='event' params={{eventId: event.id}} key={event.id}>
                <div className='feed-event-box'>
                  <div className='feed-event-image'>
                    <img className='event-banner' src='http://lorempixel.com/500/200' />
                    <img className='event-avatar' src='http://lorempixel.com/200/200' />
                    <h3>{event.name}</h3>
                  </div>
                  <div className={'feed-event-description ' + event.type}>
                    <p className='event-time-location'>
                      <span className='event-time'>
                        <Icon name='clock-o' /> <Time time={event.starts_at} format='DD/MM, HH:mm' />
                      </span>
                      <span className='event-location'>
                        <Icon name='map-marker' /> H3
                      </span>
                    </p>
                    <p className='event-description-text'>
                      {event.description.slice(0, 140)}
                    </p>
                    <div className='event-bottom'>
                      Bedriftspresentasjon
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          </div>

          <h2>Aktiviterer senere</h2>
          <div className='event-grid'>
            {events.slice(4).map(function(event) {
              return (
                <Link to='event' params={{eventId: event.id}} key={event.id}>
                  <div className={'feed-event-box ' + event.type}>
                    <h3>{event.name}</h3>
                    {event.description.slice(0, 140)}
                  </div>
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
