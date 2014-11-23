'use strict';

var React = require('react');
var Icon = require('./icon');

/**
 * Frontpage Carousel Component (TODO)
 */

var FrontPageCarousel = React.createClass({
  render: function() {
    return (
      <div className='carousel'>
        <img src='http://lorempixel.com/1400/200' />
        <div className='carousel-text'>
          <h3>Tidenes karusell? Tidenes karusell.</h3>
          <p>Her kan det jo stå masse fint.</p>
        </div>
      </div>
    );
  }
});

module.exports = FrontPageCarousel;
