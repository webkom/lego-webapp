import React from 'react';
import moment from 'moment';

/**
 * A wrapper for the HTML <time>-element
 * that automatically adds the datetime attribute and formats
 * the content according to the given props.
 */

var Time = React.createClass({

  propTypes: {
    format: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      format: 'YYYY-MM-d'
    };
  },

  render() {
    return <time dateTime={this.props.time}>{moment(this.props.time).format(this.props.format)}</time>;
  }

});

export default Time;
