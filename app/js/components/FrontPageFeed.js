
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
          <h2>Aktiviteter denne uken</h2>
          <div>
          {events.slice(0, 4).map(function(event) {
            return (
              <Link to='event' params={{eventId: event.id}} key={event.id}>
                <div className={'feed-event-box ' + event.type}>
                  <div className='feed-event-image'><img src="http://lorempixel.com/200/200" /></div>
                  <div className='feed-event-description'>
                    <h3>{event.name}</h3>
                    {event.description.slice(0, 140)}
                    <p className='event-time-location'>
                      <Icon name='clock-o' /> <Time time={event.starts_at} format='MMMM Do YYYY, HH:mm' /> @ H3
                    </p>
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
