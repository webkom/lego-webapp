'use strict';

var React = require('react');
var moment = require('moment');

/**
 * A wrapper for the HTML <time>-element
 * that automatically adds the datetime attribute and formats
 * the content according to the given props.
 */

var Time = React.createClass({

  propTypes: {
    format: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      format: 'YYYY-MM-d'
    };
  },

  render: function() {
    return <time dateTime={this.props.time}>{moment(this.props.time).format(this.props.format)}</time>;
  }

});

module.exports = Time;
