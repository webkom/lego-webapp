'use strict';

var React = require('react');
var Link = require('react-router').Link;
var Time = require('./Time');
var Icon = require('./Icon');

var EventTimeline = React.createClass({

  render: function() {
    var events = this.props.events;
    return (
      <div className='event-timeline'>
      {events.map(function(event) {
        return (
          <Link to='event' params={{eventId: event.id}} key={event.id}>
            <div className={'feed-event-box ' + event.type}>
              <div className='feed-event-image'><img src="http://www.iteraconsulting.com.ua/App_Themes/Default/Images/Logo_stor.png" /></div>
              <div className='feed-event-description'>
                <p className='event-time-location' style={{backgroundColor: event.color}}>
                  <Icon name='clock-o' /> <Time time={event.starts_at} format='dddd HH:mm' /> @ H3
                </p>
              </div>
            </div>
          </Link>
        );
      })}
      </div>
    );
  }
});

module.exports = EventTimeline;
