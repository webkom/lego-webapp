
var React = require('react');
var EventStore = require('../stores/EventStore');
var EventService = require('../services/EventService');

function getState() {
  return {
    events: EventStore.getAllSorted()
  };
}

var EventCalendarPage = React.createClass({

  getInitialState: function() {
    return getState();
  },

  componentDidMount: function() {
    EventStore.addChangeListener(this._onChange);
    if (EventStore.isEmpty()) EventService.getAllEvents();
  },

  componentWillUnmount: function() {
    EventStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getState());
  },

  render: function() {
    var events = this.state.events;
    return (
      <div className='content'>
        <h2>Events</h2>
        {events.map(function(event) {
          return <p key={event.id}>{event.name}</p>;
        })}
      </div>
    );
  }
});

module.exports = EventCalendarPage;
