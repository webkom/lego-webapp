import React from 'react';
import {Link} from 'react-router';
import Time from './Time';
import Icon from './Icon';

function randomImage() {
  var urls = [
    'http://www.iteraconsulting.com.ua/App_Themes/Default/Images/Logo_stor.png',
    'https://abakus.no/uploads/events/thumbs/2015-01-16-1359-TD%20Logo-260x110.jpg',
    'https://abakus.no/uploads/events/thumbs/2011-06-08-1343-Accenture-260x110.jpg',
    'https://abakus.no/uploads/events/thumbs/2014-11-15-0157-2013-08-10-2050-visma_bilde-578x150-578x150.jpg',
    'https://abakus.no/uploads/events/thumbs/2015-01-21-0910-lvvvvve-260x110.jpg'
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
            <p className='event-location'><Icon name='map-marker'/> H3</p>
            <img src={randomImage()} />
            <p className='event-time' style={{backgroundColor: event.color}}>
              <Icon name='clock-o' /> <Time time={event.starts_at} format='dddd HH:mm' />
            </p>
          </Link>
        );
      })}
      </div>
    );
  }
});

export default EventTimeline;
