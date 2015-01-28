'use strict';

var React = require('react');
var EventStore = require('../stores/EventStore');

var EventCalendarPage = React.createClass({

  mixins: [EventStore.mixin()],
  
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
