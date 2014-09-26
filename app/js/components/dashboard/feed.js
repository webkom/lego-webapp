/** @jsx React.DOM */

var React = require('react');
var Link = require('react-router').Link;
var EventStore = require('../../stores/EventStore');
var Time = require('../time');

var Feed = module.exports = React.createClass({

  getInitialState: function() {
    return {
      events: EventStore.all(),
      compressedMode: false
    };
  },

  update: function() {
    this.setState({events: EventStore.all()});
  },

  componentWillMount: function() {
    EventStore.fetch();
  },

  componentDidMount: function() {
    EventStore.addChangeListener(this.update);
  },

  componentWillUnmount: function() {
    EventStore.removeChangeListener(this.update);
  },

  toggleCompressedMode: function() {
    this.setState({compressedMode: !this.state.compressedMode});
  },

  render: function() {
    return (
      <div>
        <h2>Aktiviteter denne uken</h2>
        <div>
        {this.state.events.slice(0,4).map(function(event) {
          return (
            <Link to='event' params={{eventId: event.id}} key={event.id}>
              <div className={'feed-event-box ' + event.type}>
                <div className='feed-event-image'><img src={event.image} /></div>
                <div className='feed-event-description'>
                  <h3>Noe med {event.name}</h3>
                  {event.description.slice(0, 140)}
                  <p className='event-time-location'>
                    <Time time={event.startsAt} format='MMMM Do YYYY, HH:mm' /> @ H3
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
        </div>

        <h2>Aktiviterer senere</h2>
        <div className='event-grid'>
          {this.state.events.slice(4).map(function(event) {
            return (
              <Link to='event' params={{eventId: event.id}} key={event.id}>
                <div className={'feed-event-box ' + event.type}>
                  <h3>Noe med {event.name}</h3>
                  {event.description.slice(0, 140)}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
});
