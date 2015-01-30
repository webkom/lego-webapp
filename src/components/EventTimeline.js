'use strict';

var React = require('react');
var Link = require('react-router').Link;
var Time = require('./Time');
var Icon = require('./Icon');

function randomImage() {
  var urls = [
    'http://www.iteraconsulting.com.ua/App_Themes/Default/Images/Logo_stor.png',
    'https://abakus.no/uploads/events/thumbs/2015-01-16-1359-TD%20Logo-260x110.jpg',
    'https://abakus.no/uploads/events/thumbs/2011-06-08-1343-Accenture-260x110.jpg',
    'https://abakus.no/uploads/events/thumbs/2014-11-15-0157-2013-08-10-2050-visma_bilde-578x150-578x150.jpg'
  ];
  return urls[(Math.random() * urls.length) | 0];
}

var EventTimeline = React.createClass({

  render: function() {
    var events = this.props.events;
    return (
      <div className='event-timeline'>
      {events.map(function(event) {
        return (
          <Link to='event' params={{eventId: event.id}} key={event.id}>
            <div className={'event-timeline-item ' + event.type}>
              <div className='feed-event-image'><img src={randomImage()} width='150px' height='100px'/></div>
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
