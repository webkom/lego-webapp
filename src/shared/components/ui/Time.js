import React, { PropTypes } from 'react';
import moment from 'moment-timezone';
import config from '../../../config';

/**
 * A wrapper for the HTML <time>-element
 * that automatically adds the datetime attribute and formats
 * the content according to the given props.
 */
const Time = ({ format = 'YYYY-MM-d', time }) => (
  <time dateTime={time}>
    {moment.tz(time, config.timezone).format(format)}
  </time>
);

Time.propTypes = {
  format: PropTypes.string,
  time: PropTypes.string.isRequired
};

export default Time;
