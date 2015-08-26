import React, { Component, PropTypes } from 'react';
import moment from 'moment';

/**
 * A wrapper for the HTML <time>-element
 * that automatically adds the datetime attribute and formats
 * the content according to the given props.
 */

export default class Time extends Component {

  static propTypes = {
    format: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  }

  static defaultProps = {
    format: 'YYYY-MM-d'
  }

  render() {
    return <time dateTime={this.props.time}>{moment(this.props.time).format(this.props.format)}</time>;
  }

}
